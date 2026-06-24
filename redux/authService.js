import { api } from "@/redux/APIService";
import {
  FORGOT_PASSWORD,
  GET_ME,
  LOGIN,
  LOGOUT,
  REGISTER,
  RESET_PASSWORD,
  VERIFY_OTP,
} from "@/redux/Endpoint";

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
    forgotPassword: build.mutation({
      query: (payload) => ({
        url: FORGOT_PASSWORD,
        method: "POST",
        body: payload,
      }),
    }),
    verifyResetOtp: build.mutation({
      query: (payload) => ({
        url: VERIFY_OTP,
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: build.mutation({
      query: (payload) => ({
        url: RESET_PASSWORD,
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} = authApi;
