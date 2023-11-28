import { Weather, WeatherAttributesNew } from "../../models/Weather.model.js";

export async function seedWeather(attribues: WeatherAttributesNew) {
  await Weather.create(attribues);
}
