import { api } from "@/redux/APIService";
import { GeoJsonApi } from "@/redux/GeoJsonService";
import authReducer from "@/states/authSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [GeoJsonApi.reducerPath]: GeoJsonApi.reducer,
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(GeoJsonApi.middleware)
      .concat(api.middleware),
});
