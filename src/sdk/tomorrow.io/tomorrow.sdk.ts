import axios, { AxiosError } from "axios";

if (!process.env.TOMORROW_API_KEY) {
  throw new Error("TOMORROW_API_KEY is not defined");
}

if (!process.env.TOMORROW_API_URL) {
  throw new Error("TOMORROW_API_URL is not defined");
}

export interface RealtimeWeaterResponse {
  data: {
    time: string;
    values: {
      temperature: number;
      windSpeed: number;
      pressureSurfaceLevel: number;
    };
  };
}

export async function getRealtimeWeather(
  location: string,
): Promise<RealtimeWeaterResponse | void> {
  console.log("[getRealtimeWeather] request", location);

  try {
    const result = await axios.get<RealtimeWeaterResponse>(
      process.env.TOMORROW_API_URL!,
      {
        params: {
          location,
          apikey: process.env.TOMORROW_API_KEY,
        },
      },
    );
    console.log("[getRealtimeWeather] response", JSON.stringify(result.data));
    return result.data;
  } catch (err) {
    const error = err as AxiosError;
    console.log(
      "[getRealtimeWeather] response",
      error.response?.data ?? error.message,
    );
    throw err;
  }
}
