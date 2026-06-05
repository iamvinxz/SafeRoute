import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

const initialState = {
  token: null,
  isAuthenticated: false,
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.user = action.payload.user;

      SecureStore.setItemAsync("token", action.payload.token);
    },
    loginFailure: (state, action) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.user = null;

      SecureStore.deleteItemAsync("token");
    },
    rehydrate: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    clearCredentials: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  login,
  loginFailure,
  logout,
  clearCredentials,
  rehydrate,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
