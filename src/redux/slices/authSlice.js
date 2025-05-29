import { auth } from "@/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Helper function to extract user data
const extractUserData = (userCredential) => ({
  email: userCredential.user.email,
  uid: userCredential.user.uid,
  accessToken: userCredential.user.accessToken,
});

// Async thunks
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return extractUserData(userCredential);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return extractUserData(userCredential);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Initial state - now focused only on authentication
const initialState = {
  user: null,
  loading: false,
  authReady: false,
  error: null,
};

// Helper functions for loading states
const setPending = (state) => {
  state.loading = true;
  state.error = null;
};

const setFulfilled = (state, user = null) => {
  state.loading = false;
  state.user = user;
  state.error = null;
  if (user) state.authReady = true;
};

const setRejected = (state, error) => {
  state.loading = false;
  state.error = error;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.authReady = true;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetAuthState: (state) => {
      return initialState;
    },

    setAuthReady: (state, action) => {
      state.authReady = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, setPending)
      .addCase(signIn.fulfilled, (state, action) =>
        setFulfilled(state, action.payload),
      )
      .addCase(signIn.rejected, (state, action) =>
        setRejected(state, action.payload),
      )

      // Sign Up
      .addCase(signUp.pending, setPending)
      .addCase(signUp.fulfilled, (state, action) =>
        setFulfilled(state, action.payload),
      )
      .addCase(signUp.rejected, (state, action) =>
        setRejected(state, action.payload),
      )

      // Sign Out
      .addCase(signOut.pending, setPending)
      .addCase(signOut.fulfilled, (state) => setFulfilled(state, null))
      .addCase(signOut.rejected, (state, action) =>
        setRejected(state, action.payload),
      );
  },
});

export const { setUser, clearError, resetAuthState, setAuthReady } =
  authSlice.actions;

export default authSlice.reducer;
