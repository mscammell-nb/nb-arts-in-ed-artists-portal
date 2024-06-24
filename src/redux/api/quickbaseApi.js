import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quickbaseApi = createApi({
  reducerPath: "quickbaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.quickbase.com/v1",
  }),
  endpoints: (build) => ({
    addOrUpdateRecord: build.mutation({
      query: (body) => ({
        url: "/records",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "QB-Realm-Hostname": "nassauboces.quickbase.com",
          Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
        },
        body,
      }),
    }),
  }),
});

export const { useAddOrUpdateRecordMutation } = quickbaseApi;
