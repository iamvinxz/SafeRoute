import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

const initialState = {
  token: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

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

      SecureStore.deleteItemAsync("token");
    },
    rehydrate: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
  },
});

export const { login, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
