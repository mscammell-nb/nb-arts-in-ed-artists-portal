import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { quickbaseApi } from "./api/quickbaseApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [quickbaseApi.reducerPath]: quickbaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, quickbaseApi.middleware),
  devTools: import.meta.env.VITE_MODE !== 'production', // Enable Redux DevTools in development mode
});

export default store;
