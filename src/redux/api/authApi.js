import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/auth" }),
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = authApi;
