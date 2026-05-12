import { api } from "@/redux/APIService";
import { LOGIN, REGISTER } from "@/redux/Endpoint";

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
    register: build.mutation({
      query: (payload) => ({
        url: REGISTER,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApi;
