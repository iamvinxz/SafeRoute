import { api } from "@/redux/APIService";
import { LOGIN } from "@/redux/Endpoint";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (payload) => ({
        url: LOGIN,
        method: "POST",
        body: payload,
      }),
    }),
    logout: build.mutation({
      query: (payload) => ({
        url: LOGOUT,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
