import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AUTHORIZATION_TOKEN = "b9dwzc_br69_0_b68448zwujbd4d3336nqbd2m7r2";

export const artistsApi = createApi({
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
          Authorization: `QB-USER-TOKEN ${AUTHORIZATION_TOKEN}`,
        },
        body,
      }),
    }),
  }),
});

export const { useAddArtistMutation } = artistsApi;
