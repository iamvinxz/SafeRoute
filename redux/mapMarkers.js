import { api } from "@/redux/APIService";
import { GET_ALL_PINNED_LOCATIONS, GET_SEGMENTS } from "@/redux/Endpoint";

const mapMarkersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllSegments: build.query({
      query: () => ({
        url: GET_SEGMENTS,
      }),
      providesTags: ["FloodSegments"],
    }),
    getAllPinnedLocations: build.query({
      query: () => ({
        url: GET_ALL_PINNED_LOCATIONS,
      }),
      providesTags: ["PinnedLocations"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllSegmentsQuery, useGetAllPinnedLocationsQuery } =
  mapMarkersApi;
