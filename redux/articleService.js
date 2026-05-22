import { api } from "@/redux/APIService";
import { GET_ALL_ARTICLES } from "@/redux/Endpoint";

const article = api.injectEndpoints({
  endpoints: (build) => ({
    getAllArticles: build.query({
      query: () => ({
        url: GET_ALL_ARTICLES,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllArticlesQuery } = article;
