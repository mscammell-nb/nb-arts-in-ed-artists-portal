import { createSlice } from "@reduxjs/toolkit";
import { signOut } from "./authSlice"; // Import to listen for logout

const initialState = {
  artistOrg: null,
  artistRecordId: null,
  has3References: false,
};

export const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    setArtistData: (state, action) => {
      const { artistOrg, artistRecordId, has3References } = action.payload;
      state.artistOrg = artistOrg;
      state.artistRecordId = artistRecordId;
      state.error = null;
      state.has3References = has3References;
    },

    updateArtistOrg: (state, action) => {
      state.org = action.payload;
    },
    updateReferences: (state, action) => {
      state.has3References = action.payload;
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
  setArtistLoading,
  setArtistError,
  clearArtistData,
} = artistSlice.actions;

export default artistSlice.reducer;
