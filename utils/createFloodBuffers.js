import * as turf from "@turf/turf";

function createFloodBuffers(floodSegments) {
  return floodSegments.map((segment) => {
    const floodLine = turf.lineString(
      segment.coords.map(([lat, lng]) => [lng, lat]),
    );

    return turf.buffer(floodLine, 10, {
      units: "meters",
    });
  });
}

export default createFloodBuffers;
