import { GEOJSON_ENDPOINT, GET_TINAJEROS } from "@/redux/Endpoint";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: GEOJSON_ENDPOINT,
});

export const GeoJsonApi = createApi({
  reducerPath: "geojson",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTinajeros: builder.query({
      query: () => ({
        url: GET_TINAJEROS,
      }),
      transformResponse: (data) => ({
        ...data,
        features: data.features.filter((f) =>
          f.properties.adm4_en?.toLowerCase().includes("tinajeros"),
        ),
      }),
    }),
  }),
});

export const { useGetTinajerosQuery } = GeoJsonApi;
