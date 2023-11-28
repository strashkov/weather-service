import { v4 } from "uuid";
import { wsx } from "../app/server.js";
import { historicalData } from "./historical.controller.js";
import { HistoricalDataRequestMessagePayload } from "./historical.dto.js";
import { AggregationType } from "../services/weather/historical.service.js";
import { seedWeather } from "../tests/seeds/Weather.seed.js";
import { WeatherAttributesNew } from "../models/Weather.model.js";

describe("/historical", () => {
  it("success", (done) => {
    const channel = wsx.route("/historical");
    historicalData(channel as any);
    const client = wsx.inject("/historical");
    const requestId = v4();
    const city = v4();
    const fakeWeather1: WeatherAttributesNew = {
      city,
      datetime: "2023-01-01T01:00:00.000Z",
      temperature: 1,
      windSpeed: 2,
      pressureSurfaceLevel: 3,
    };
    const fakeWeather2: WeatherAttributesNew = {
      city,
      datetime: "2023-01-01T01:01:00.000Z",
      temperature: 4,
      windSpeed: 6,
      pressureSurfaceLevel: 11,
    };
    const message: HistoricalDataRequestMessagePayload = {
      type: "historical:get:request",
      requestId,
      payload: {
        params: {
          city,
          from: "2023-01-01T01:00:00.000Z",
          to: "2023-01-01T02:00:00.000Z",
          aggregation: "5m" as unknown as AggregationType,
        },
      },
    };

    Promise.all([seedWeather(fakeWeather1), seedWeather(fakeWeather2)]).then(
      () => {
        client.send(JSON.stringify(message));
      },
    );

    client.onmessage = ({ data }) => {
      const parsed = JSON.parse(data);

      expect(parsed).toMatchObject({
        type: "historical:get:response",
        requestId,
        payload: {
          result: [
            {
              city,
              datetime: "2023-01-01T01:00:00.000Z",
              weather: {
                temperature: 2.5,
                windSpeed: 4,
                pressureSurfaceLevel: 7,
              },
            },
          ],
        },
      });
      done();
    };
  });
});
