import { authApi } from "@/redux/authService";
import { GET_SEGMENTS } from "@/redux/Endpoint";

const mapMarkersApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSegments: build.query({
      query: () => ({
        url: GET_SEGMENTS,
      }),
    }),
  }),
});

export const { useGetAllSegmentsQuery } = mapMarkersApi;
