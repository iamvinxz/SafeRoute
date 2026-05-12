const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  age: null,
  phone: null,
  password: null,
  isPwd: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setAge: (state, action) => {
      state.age = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setIsPwd: (state, action) => {
      state.isPwd = action.payload;
    },
    clearRegister: () => initialState,
  },
});

export const { setAge, setPhone, setPassword, setIsPwd, clearRegister } =
  registerSlice.actions;
export default registerSlice.reducer;
