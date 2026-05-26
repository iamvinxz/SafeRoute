import { api } from "@/redux/APIService";
import { UPDATE_FCM_TOKEN } from "@/redux/Endpoint";

const fcmApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateFCMToken: build.mutation({
      query: (fcmToken) => ({
        url: UPDATE_FCM_TOKEN,
        method: "PATCH",
        body: { fcmToken },
      }),
    }),
  }),
});

export const { useUpdateFCMTokenMutation } = fcmApi;
