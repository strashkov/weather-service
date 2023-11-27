import { WsapixChannel, WsapixClient } from "wsapix";
import { withRequestId } from "../lib/async.js";
import {
  HistoricalDataRequestMessagePayload,
  historicalDataRequestMessageSchema,
  historicalDataResponseMessageSchema,
} from "./historical.dto.js";
import { findWeather } from "../services/weather/historical.service.js";

export function historicalData(
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

  channel.clientMessage<HistoricalDataRequestMessagePayload>(
    { type: historicalDataRequestMessageSchema.$id! },
    historicalDataRequestMessageSchema,
    (client, { requestId, payload: { params } }) => {
      withRequestId(requestId, async (getRequestId) => {
        const result = await findWeather(params);

        client.send({
          type: historicalDataResponseMessageSchema.$id!,
          requestId: getRequestId(),
          payload: {
            result,
          },
        });
      });
    },
  );
  channel.serverMessage(
    { type: historicalDataResponseMessageSchema.$id! },
    historicalDataResponseMessageSchema,
  );
}
