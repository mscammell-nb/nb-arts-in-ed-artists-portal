import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quickbaseApi = createApi({
  reducerPath: "quickbaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.quickbase.com/v1",
  }),
  tagTypes: ["QuickbaseRecords"],
  keepUnusedDataFor: 300, // This will cache our data for 5 minutes (300s)
  endpoints: (build) => ({
    queryForData: build.query({
      query: (body) => ({
        url: "/records/query",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "QB-Realm-Hostname": import.meta.env.VITE_QB_REALM_HOSTNAME,
          Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
        },
        body,
      }),
      providesTags: ["QuickbaseRecords"],
    }),
    getField: build.query({
      query: ({ fieldId, tableId }) => ({
        url: `/fields/${fieldId}?tableId=${tableId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "QB-Realm-Hostname": import.meta.env.VITE_QB_REALM_HOSTNAME,
          Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
        },
      }),
    }),
    addOrUpdateRecord: build.mutation({
      query: (body) => ({
        url: "/records",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "QB-Realm-Hostname": import.meta.env.VITE_QB_REALM_HOSTNAME,
          Authorization: `QB-USER-TOKEN ${import.meta.env.VITE_QUICKBASE_AUTHORIZATION_TOKEN}`,
        },
        body,
      }),
      invalidatesTags: ["QuickbaseRecords"],
    }),
  }),
});

export const {
  useAddOrUpdateRecordMutation,
  useQueryForDataQuery,
  useGetFieldQuery,
  useLazyQueryForDataQuery,
} = quickbaseApi;
