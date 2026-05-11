const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isOpen: false,
};
const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    isOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { isOpen } = modalSlice.actions;
export default modalSlice.reducer;
