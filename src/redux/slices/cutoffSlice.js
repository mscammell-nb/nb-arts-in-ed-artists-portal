import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "./authSlice";

const initialState = {
  registrationCutoffStartDate: null,
  registrationCutoffEndDate: null,
  programCutoffStartDate: null,
  programCutoffEndDate: null,
};

const cutoffSlice = createSlice({
  name: "cutoff",
  initialState,
  reducers: {
    updateCutoffDates: (state, action) => {
      const {
        registrationCutoffStartDate,
        registrationCutoffEndDate,
        programCutoffStartDate,
        programCutoffEndDate,
      } = action.payload;
      state.programCutoffStartDate = programCutoffStartDate;
      state.programCutoffEndDate = programCutoffEndDate;
      state.registrationCutoffStartDate = registrationCutoffStartDate;
      state.registrationCutoffEndDate = registrationCutoffEndDate;
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
