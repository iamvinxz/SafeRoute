import { authApi } from "@/redux/authService";
import { GET_ALL_PINNED_LOCATIONS, GET_SEGMENTS } from "@/redux/Endpoint";

const mapMarkersApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSegments: build.query({
      query: () => ({
        url: GET_SEGMENTS,
      }),
    }),
    getAllPinnedLocations: build.query({
      query: () => ({
        url: GET_ALL_PINNED_LOCATIONS,
      }),
    }),
  }),
});

export const { useGetAllSegmentsQuery, useGetAllPinnedLocationsQuery } =
  mapMarkersApi;
