const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  streetName: "",
  floodDepth: "",
  description: "",
  photoUrl: null,
  coords: [],
};

const floodReportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setStreetName: (state, action) => {
      state.streetName = action.payload;
    },
    setFloodDepth: (state, action) => {
      state.floodDepth = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setPhotoUrl: (state, action) => {
      state.photoUrl = action.payload;
    },
    setCoords: (state, action) => {
      state.coords = action.payload;
    },
    resetReport: () => initialState,
  },
});

export const {
  setStreetName,
  setFloodDepth,
  setDescription,
  setPhotoUrl,
  setCoords,
  resetReport,
} = floodReportSlice.actions;
export default floodReportSlice.reducer;
