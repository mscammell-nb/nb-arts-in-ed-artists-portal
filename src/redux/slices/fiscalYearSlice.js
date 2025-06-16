import { getCurrentFiscalYear, getCurrentFiscalYearKey } from "@/utils/utils";
import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "./authSlice";

const initialState = {
  fiscalYear: getCurrentFiscalYear(),
  fiscalYearKey: getCurrentFiscalYearKey(),
};

const fiscalYearSlice = createSlice({
  name: "fiscalYear",
  initialState,
  reducers: {
    updateFiscalYear: (state, action) => {
      const { fiscalYear, fiscalYearKey } = action.payload;
      state.fiscalYear = fiscalYear;
      state.fiscalYearKey = fiscalYearKey;
    },
    clearFiscalYear: (state) => {
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

export const { updateFiscalYear, clearFiscalYear } = fiscalYearSlice.actions;

export default fiscalYearSlice.reducer;
