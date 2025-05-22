import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "./authSlice"; // Import to listen for logout

const initialState = {
  artistOrg: null,
  artistRecordId: null,
  cutoffDate: null,
  programCutoffDate: null,
  has3References: false,
};

export const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    setArtistData: (state, action) => {
      const {
        artistOrg,
        artistRecordId,
        cutoffDate,
        programCutoffDate,
        has3References,
      } = action.payload;
      state.artistOrg = artistOrg;
      state.artistRecordId = artistRecordId;
      state.cutoffDate = cutoffDate;
      state.programCutoffDate = programCutoffDate;
      state.error = null;
      state.has3References = has3References;
    },

    updateArtistOrg: (state, action) => {
      state.org = action.payload;
    },

    updateCutoffDates: (state, action) => {
      const { cutoffDate, programCutoffDate } = action.payload;
      state.cutoffDate = cutoffDate;
      state.programCutoffDate = programCutoffDate;
    },

    setArtistLoading: (state, action) => {
      state.loading = action.payload;
    },

    setArtistError: (state, action) => {
      state.error = action.payload;
    },

    clearArtistData: (state) => {
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

export const {
  setArtistData,
  updateArtistOrg,
  updateCutoffDates,
  setArtistLoading,
  setArtistError,
  clearArtistData,
} = artistSlice.actions;

// Artist selectors
export const selectArtistOrg = (state) => state.artist.artistOrg;
export const selectArtistRecordId = (state) => state.artist?.artistRecordId;
export const selectCutoffDate = (state) => state.artist.cutoffDate;
export const selectProgramCutoffDate = (state) =>
  state.artist.programCutoffDate;
export const selectHas3References = (state) => state.artist.has3References;
export const selectArtistData = (state) => state.artist;
export const selectArtistLoading = (state) => state.artist.loading;
export const selectArtistError = (state) => state.artist.error;

export default artistSlice.reducer;
