import { api } from "@/redux/APIService";
import { GeoJsonApi } from "@/redux/GeoJsonService";
import authReducer from "@/states/authSlice";
import modalReducer from "@/states/modalSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [GeoJsonApi.reducerPath]: GeoJsonApi.reducer,
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(GeoJsonApi.middleware)
      .concat(api.middleware),
});
