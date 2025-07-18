import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "./authSlice"; // Import to listen for logout

const initialState = {
  artistOrg: null,
  artistRecordId: null,
  has3References: false,
  vendorType: null,
  numberOfPerformers: 0,
};

export const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    setArtistData: (state, action) => {
      const {
        artistOrg,
        artistRecordId,
        has3References,
        vendorType,
        numberOfPerformers,
      } = action.payload;
      state.artistOrg = artistOrg;
      state.artistRecordId = artistRecordId;
      state.error = null;
      state.has3References = has3References;
      state.vendorType = vendorType;
      state.numberOfPerformers = numberOfPerformers;
    },

    updateArtistOrg: (state, action) => {
      state.org = action.payload;
    },
    updateReferences: (state, action) => {
      state.has3References = action.payload;
    },
    updateVendorType: (state, action) => {
      state.vendorType = action.payload;
    },

    setArtistLoading: (state, action) => {
      state.loading = action.payload;
    },

    setArtistError: (state, action) => {
      state.error = action.payload;
    },
    incrementNumberOfPerformers: (state) => {
      state.numberOfPerformers += 1;
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
  setArtistLoading,
  setArtistError,
  incrementNumberOfPerformers,
  clearArtistData,
} = artistSlice.actions;

export default artistSlice.reducer;
