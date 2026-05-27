import { api } from "@/redux/APIService";
import { GET_ALL_ANNOUNCEMENT } from "@/redux/Endpoint";

const announcement = api.injectEndpoints({
  endpoints: (build) => ({
    getAllAnnouncement: build.query({
      query: () => ({
        url: GET_ALL_ANNOUNCEMENT,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllAnnouncementQuery } = announcement;
