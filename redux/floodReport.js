import { api } from "@/redux/APIService";
import { CREATE_FLOOD_REPORT } from "@/redux/Endpoint";

const reportApi = api.injectEndpoints({
  endpoints: (build) => ({
    createFloodReport: build.mutation({
      query: (payload) => ({
        url: CREATE_FLOOD_REPORT,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCreateFloodReportMutation } = reportApi;
