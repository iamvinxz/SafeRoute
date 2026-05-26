import { api } from "@/redux/APIService";
import { GET_SOS_BY_ID, SEND_SOS } from "@/redux/Endpoint";

const sosApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendSos: build.mutation({
      query: (payload) => ({
        url: SEND_SOS,
        method: "POST",
        body: payload,
      }),
    }),
    getSosById: build.query({
      query: (id) => ({
        url: GET_SOS_BY_ID,
        params: { id },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useSendSosMutation, useGetSosByIdQuery } = sosApi;
