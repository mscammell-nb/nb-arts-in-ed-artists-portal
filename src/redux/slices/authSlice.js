import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "@/firebaseConfig";

export const signIn = createAsyncThunk("auth/signIn", async ({email, password}, {rejectWithValue}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      accessToken: userCredential.user.accessToken
    }
  } catch(error) {
    return rejectWithValue(error.message);
  }
});

export const signUp = createAsyncThunk("auth/signUp", async({email, password}, {rejectWithValue}) => {
  try{
    const userCredential= await createUserWithEmailAndPassword(auth, email, password);
    return {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      accessToken: userCredential.user.accessToken
    }
  }catch(error) {
    return rejectWithValue(error.message)
  }
});

export const signOut = createAsyncThunk("auth/signOut", async (_, {rejectWithValue}) => {
  try{
    await firebaseSignOut(auth);
    return null
  } catch (error) {
    return rejectWithValue(error.message);
  }
})

const initialState = {
  user: null,
  loading: true,
  authReady: false,
  error: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
