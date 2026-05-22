import { api } from "@/redux/APIService";
import { SEND_SOS } from "@/redux/Endpoint";

const sosApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendSos: build.mutation({
      query: (payload) => ({
        url: SEND_SOS,
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useSendSosMutation } = sosApi;
