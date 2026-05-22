import { api } from "@/redux/APIService";
import { GET_ME, LOGIN, LOGOUT, REGISTER } from "@/redux/Endpoint";

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
      query: () => ({
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
    getMe: build.query({
      query: () => ({
        url: GET_ME,
      }),
      providesTags: ["Me"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetMeQuery,
} = authApi;
