import { api } from "@/redux/APIService";
import { GET_ALL_PINNED_LOCATIONS, GET_SEGMENTS } from "@/redux/Endpoint";

const mapMarkersApi = api.injectEndpoints({
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
  overrideExisting: true,
});

export const { useGetAllSegmentsQuery, useGetAllPinnedLocationsQuery } =
  mapMarkersApi;
