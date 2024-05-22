import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: 1,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    set: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { set } = authSlice.actions;

export default authSlice.reducer;
