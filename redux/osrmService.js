import createFloodBuffers from "@/utils/createFloodBuffers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as turf from "@turf/turf";

const MAX_REROUTE_ATTEMPTS = 8;
const BYPASS_STEP_METERS = 40;

function findAllFloodIntersections(routeCoords, floodBuffers) {
  const routeLine = turf.lineString(
    routeCoords.map(([lat, lng]) => [lng, lat]),
  );
  return floodBuffers.filter((buffer) =>
    turf.booleanIntersects(routeLine, buffer),
  );
}

function getFloodEntryExit(routeCoords, floodBuffer) {
  let entryIndex = -1;
  let exitIndex = -1;
  for (let i = 0; i < routeCoords.length; i++) {
    const [lat, lng] = routeCoords[i];
    if (turf.booleanPointInPolygon(turf.point([lng, lat]), floodBuffer)) {
      if (entryIndex === -1) entryIndex = i;
      exitIndex = i;
    }
  }
  return { entryIndex, exitIndex };
}

/**
 * For a single flood buffer, compute an approach+departure waypoint pair
 * that sandwiches it. The side (left/right) alternates per attempt.
 */
function computeBypassForBuffer(routeCoords, floodBuffer, stepMeters, attempt) {
  const { entryIndex, exitIndex } = getFloodEntryExit(routeCoords, floodBuffer);

  const safeEntry =
    entryIndex === -1 ? Math.floor(routeCoords.length * 0.4) : entryIndex;
  const safeExit =
    exitIndex === -1 ? Math.floor(routeCoords.length * 0.6) : exitIndex;

  const preIndex = Math.max(0, safeEntry - 1);
  const postIndex = Math.min(routeCoords.length - 1, safeExit + 1);

  const [preLat, preLng] = routeCoords[preIndex];
  const [entryLat, entryLng] = routeCoords[safeEntry];
  const [exitLat, exitLng] = routeCoords[safeExit];
  const [postLat, postLng] = routeCoords[postIndex];

  const entryBearing = turf.bearing(
    turf.point([preLng, preLat]),
    turf.point([entryLng, entryLat]),
  );
  const exitBearing = turf.bearing(
    turf.point([exitLng, exitLat]),
    turf.point([postLng, postLat]),
  );

  const sideOffset = attempt % 2 === 0 ? 90 : -90;

  const approachBase = turf.destination(
    turf.point([entryLng, entryLat]),
    stepMeters / 1000,
    (entryBearing + 180) % 360,
    { units: "kilometers" },
  );
  const approachPt = turf.destination(
    approachBase,
    stepMeters / 1000,
    (entryBearing + sideOffset + 360) % 360,
    { units: "kilometers" },
  );

  const departureBase = turf.destination(
    turf.point([exitLng, exitLat]),
    stepMeters / 1000,
    exitBearing,
    { units: "kilometers" },
  );
  const departurePt = turf.destination(
    departureBase,
    stepMeters / 1000,
    (exitBearing + sideOffset + 360) % 360,
    { units: "kilometers" },
  );

  const [aLng, aLat] = approachPt.geometry.coordinates;
  const [dLng, dLat] = departurePt.geometry.coordinates;

  return { approach: [aLat, aLng], departure: [dLat, dLng] };
}

async function fetchOsrmRoute(waypoints, mode) {
  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url =
    `${process.env.EXPO_PUBLIC_OSRM_URI}/route/v1/${mode}/${coords}` +
    `?overview=full&geometries=geojson&alternatives=true`;
  console.log("[OSRM] Requesting:", url);
  const res = await fetch(url);
  return res.json();
}

function pickSafeRoute(data, floodBuffers) {
  if (!data.routes?.length) return null;

  const analyzed = data.routes.map((route) => {
    const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const hitBuffers = findAllFloodIntersections(coords, floodBuffers);
    return { route, coords, hitBuffers };
  });

  console.log(
    "[OSRM] Route analysis:",
    analyzed.map((r, i) => ({
      route: i + 1,
      crossesFlood: r.hitBuffers.length > 0,
      floodCount: r.hitBuffers.length,
    })),
  );

  const safeRoutes = analyzed.filter((r) => r.hitBuffers.length === 0);

  if (!safeRoutes.length) {
    // Pick the route crossing the fewest flood buffers as the best to work with
    const best = [...analyzed].sort(
      (a, b) => a.hitBuffers.length - b.hitBuffers.length,
    )[0];
    return { safe: false, bestUnsafe: best };
  }

  safeRoutes.sort((a, b) => a.route.duration - b.route.duration);
  return {
    safe: true,
    route: safeRoutes[0].route,
    coords: safeRoutes[0].coords,
  };
}

export const osrmApi = createApi({
  reducerPath: "osrmApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_OSRM_URI,
  }),
  endpoints: (builder) => ({
    getRoute: builder.query({
      queryFn: async ({ points, mode = "foot", floodSegments = [] }) => {
        try {
          if (!points || points.length < 2) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "At least 2 points are required",
              },
            };
          }

          const floodBuffers = createFloodBuffers(floodSegments);
          console.log(`[OSRM] Total flood buffers: ${floodBuffers.length}`);

          // Each entry is { approach, departure } for one flood buffer
          // We accumulate bypasses across attempts and rebuild the waypoint list each time
          let allBypasses = [];
          let avoidedFlood = false;

          for (let attempt = 1; attempt <= MAX_REROUTE_ATTEMPTS; attempt++) {
            const bypassWaypoints = allBypasses.flatMap((b) => [
              b.approach,
              b.departure,
            ]);
            const waypoints = [
              points[0],
              ...bypassWaypoints,
              points[points.length - 1],
            ];

            console.log(
              `[OSRM] Attempt ${attempt}/${MAX_REROUTE_ATTEMPTS}, waypoints: ${waypoints.length}`,
            );

            const data = await fetchOsrmRoute(waypoints, mode);

            if (!data.routes?.length) {
              return {
                error: {
                  status: "CUSTOM_ERROR",
                  error: "No route found from OSRM",
                },
              };
            }

            const result = pickSafeRoute(data, floodBuffers);

            if (result.safe) {
              return {
                data: {
                  coordinates: result.coords,
                  distanceKm: (result.route.distance / 1000).toFixed(2),
                  durationMin: Math.ceil(result.route.duration / 60),
                  avoidedFlood,
                },
              };
            }

            if (attempt === MAX_REROUTE_ATTEMPTS) break;

            avoidedFlood = true;
            const { bestUnsafe } = result;
            const stepMeters = BYPASS_STEP_METERS * attempt;

            // Inject a bypass for EVERY flood buffer the best route hits, not just the first
            const newBypasses = bestUnsafe.hitBuffers.map((buffer) =>
              computeBypassForBuffer(
                bestUnsafe.coords,
                buffer,
                stepMeters,
                attempt,
              ),
            );

            allBypasses = [...allBypasses, ...newBypasses];

            console.log(
              `[OSRM] Added ${newBypasses.length} bypass(es) for ${bestUnsafe.hitBuffers.length} flood buffer(s), step ${stepMeters}m`,
            );
          }

          // Truly no route possible (e.g. island, missing road data)
          return {
            error: {
              status: "NO_SAFE_ROUTE",
              error:
                "Could not find a flood-free route. The destination may be inaccessible due to flooding.",
            },
          };
        } catch (error) {
          console.error("[OSRM] Unexpected error:", error);
          return {
            error: { status: "FETCH_ERROR", error: error.message },
          };
        }
      },
    }),
  }),
});

export const { useGetRouteQuery, useLazyGetRouteQuery } = osrmApi;
