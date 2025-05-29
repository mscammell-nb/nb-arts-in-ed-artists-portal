import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { quickbaseApi } from "./api/quickbaseApi";
import artistReducer from "./slices/artistSlice"; // Add this import
import authReducer from "./slices/authSlice";
import cutoffReducer from "./slices/cutoffSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    artist: artistReducer, // Add artist reducer
    cutoff: cutoffReducer,
    [authApi.reducerPath]: authApi.reducer,
    [quickbaseApi.reducerPath]: quickbaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, quickbaseApi.middleware),
  devTools: import.meta.env.VITE_MODE !== "production",
});

export default store;
