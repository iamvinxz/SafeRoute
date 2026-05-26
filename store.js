import { api } from "@/redux/APIService";
import { GeoJsonApi } from "@/redux/GeoJsonService";
import authReducer from "@/states/authSlice";
import floodReportReducer from "@/states/floodReportSlice";
import modalReducer from "@/states/modalSlice";
import registerReducer from "@/states/registerSlice";
import sosAlertReducer from "@/states/sosAlertSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [GeoJsonApi.reducerPath]: GeoJsonApi.reducer,
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    register: registerReducer,
    modal: modalReducer,
    report: floodReportReducer,
    sosAlert: sosAlertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(GeoJsonApi.middleware)
      .concat(api.middleware),
});
