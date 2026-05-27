import { api } from "@/redux/APIService";
import { GET_WEATHER_TODAY } from "@/redux/Endpoint";

const weather = api.injectEndpoints({
  endpoints: (build) => ({
    getWeather: build.query({
      query: ({ latitude, longitude }) => ({
        url: GET_WEATHER_TODAY,
        method: "POST",
        body: { latitude, longitude },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetWeatherQuery } = weather;
