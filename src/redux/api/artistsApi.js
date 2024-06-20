import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const artistsApi = createApi({
  reducerPath: "artistsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.quickbase.com/v1/records/",
  }),
  endpoints: (build) => ({
    addArtist: build.mutation({
      query: (body) => ({
        url: "",
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

export const { useAddArtistMutation } = artistsApi;
