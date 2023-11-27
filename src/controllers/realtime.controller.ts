import { WsapixChannel, WsapixClient } from "wsapix";
import {
  RealtimeWeatherData,
  listenToCity,
  events,
  unlistenToCity,
  validateCity,
} from "../services/weather/realtime.service.js";
import {
  RealtimeSubscribeRequestMessagePayload,
  realtimeDataMessageSchema,
  realtimeSubscribeRequestMessageSchema,
  realtimeSubscribeResponseMessageSchema,
} from "./realtime.dto.js";
import { withRequestId } from "../lib/async.js";

export function realtimeData(
  channel: WsapixChannel<
    any,
    {
      cities?: Set<string>;
    }
  >,
) {
  channel.on("error", (client, message, data) => {
    client.send({
      type: data.type.replace("request", "response"),
      requestId: data.requestId,
      payload: {
        error: {
          message,
        },
      },
    });
  });

  channel.clientMessage<RealtimeSubscribeRequestMessagePayload>(
    { type: realtimeSubscribeRequestMessageSchema.$id! },
    realtimeSubscribeRequestMessageSchema,
    (
      client,
      {
        requestId,
        payload: {
          params: { city },
        },
      },
    ) => {
      withRequestId(requestId, async (getRequestId) => {
        if (!(await validateCity(city))) {
          client.send({
            type: realtimeSubscribeResponseMessageSchema.$id!,
            requestId: getRequestId(),
            payload: {
              error: {
                message: `Could not fetch weather for city "${city}"`,
              },
            },
          });

          return;
        }

        const cities = client.state?.cities ?? new Set();

        cities.add(city);
        client.state = {
          cities,
        };

        listenToCity(city);

        client.send({
          type: realtimeSubscribeResponseMessageSchema.$id!,
          requestId: getRequestId(),
          payload: {
            result: "ok",
          },
        });
      });
    },
  );
  channel.serverMessage(
    { type: realtimeSubscribeResponseMessageSchema.$id! },
    realtimeSubscribeResponseMessageSchema,
  );
  channel.serverMessage(
    { type: realtimeDataMessageSchema.$id! },
    realtimeDataMessageSchema,
  );

  events.on("data", (data: RealtimeWeatherData[]) => {
    const clientByCity = Array.from(channel.clients).reduce<
      Map<string, Set<WsapixClient>>
    >((acc, client) => {
      const cities = client.state?.cities as Set<string>;

      if (!cities) {
        return acc;
      }

      for (const city of cities) {
        const set = acc.get(city) ?? new Set();

        set.add(client);
        acc.set(city, set);
      }

      return acc;
    }, new Map());

    data.forEach(({ city, datetime, weather }) => {
      const clients = clientByCity.get(city);

      if (!clients) {
        unlistenToCity(city);
        return;
      }

      const weatherJson = weather.toJSON();

      for (const client of clients) {
        client.send({
          type: realtimeDataMessageSchema.$id,
          payload: {
            result: {
              city,
              datetime,
              weather: {
                temperature: weatherJson.temperature,
                windSpeed: weatherJson.windSpeed,
                pressureSurfaceLevel: weatherJson.pressureSurfaceLevel,
              },
            },
          },
        });
      }
    });
  });
}
