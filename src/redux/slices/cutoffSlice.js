import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "./authSlice";

const initialState = {
  cutoffDate: null,
  programCutoffDate: null,
};

const cutoffSlice = createSlice({
  name: "cutoff",
  initialState,
  reducers: {
    updateCutoffDates: (state, action) => {
      const { cutoffDate, programCutoffDate } = action.payload;
      state.cutoffDate = cutoffDate;
      state.programCutoffDate = programCutoffDate;
    },
    clearCutoffDates: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Clear artist data when user signs out
      .addCase(signOut.fulfilled, (state) => {
        return initialState;
      });
  },
});

export const { updateCutoffDates, clearCutoffDates } = cutoffSlice.actions;

export default cutoffSlice.reducer;
