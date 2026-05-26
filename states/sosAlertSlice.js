import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeSosId: null,
  status: null,
  showModal: false,
};

const sosAlertSlice = createSlice({
  name: "sosAlert",
  initialState,
  reducers: {
    setSosAlert: (state, action) => {
      state.activeSosId = action.payload.sosId;
      state.status = action.payload.status;
      state.showModal = true;
    },
    updateSosAlertStatus: (state, action) => {
      state.status = action.payload;
    },

    hideSosModal: (state) => {
      state.showModal = false;
    },
    clearSosAlert: (state) => {
      state.activeSosId = null;
      state.status = null;
      state.showModal = false;
    },
  },
});

export const {
  setSosAlert,
  updateSosAlertStatus,
  clearSosAlert,
  hideSosModal,
} = sosAlertSlice.actions;
export default sosAlertSlice.reducer;
