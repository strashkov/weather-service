import { Weather } from "./Weather.model.js";

export async function initModels() {
  await Weather.sync({ alter: true });
}
