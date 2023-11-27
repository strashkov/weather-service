import { EventEmitter } from "node:events";
import { Weather } from "../../models/Weather.model.js";
import {
  RealtimeWeaterResponse,
  getRealtimeWeather,
} from "../../sdk/tomorrow.io/tomorrow.sdk.js";

const cities = new Set<string>();
const fetchInterval = 60_000; // 1m

export interface RealtimeWeatherData {
  city: string;
  datetime: string;
  weather: Weather;
}

export async function validateCity(city: string): Promise<boolean> {
  try {
    await getRealtimeWeather(city);
    return true;
  } catch (err) {
    return false;
  }
}

export function listenToCity(city: string) {
  cities.add(city);
}

export function unlistenToCity(city: string) {
  cities.delete(city);
}

export const events = new EventEmitter();

async function fetchData() {
  const citiesAsArray = Array.from(cities);
  const results = await Promise.allSettled(
    citiesAsArray.map((city) => getRealtimeWeather(city)),
  );
  const data: RealtimeWeatherData[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const { data: value } = result.value as RealtimeWeaterResponse;
      const city = citiesAsArray[index];
      const datetime = value.time;
      const weather = Weather.build({
        city,
        datetime,
        ...value.values,
      });
      data.push({
        city,
        datetime: value.time,
        weather,
      });
    } else {
      // TODO handle API error
    }
  });

  events.emit("data", data);

  await Weather.bulkCreate(data.map(({ weather }) => weather.toJSON()));
}

setInterval(fetchData, fetchInterval);
