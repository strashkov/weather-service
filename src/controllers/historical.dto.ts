import { MessageSchema } from "wsapix";
import { AggregationType } from "../services/weather/historical.service.js";

const historicalDataMessageType = "historical:get";

export interface HistoricalDataRequestMessagePayload {
  type: "historical:get:request";
  requestId: string;
  payload: {
    params: {
      city: string;
      from: string;
      to: string;
      aggregation: AggregationType;
    };
  };
}

export const historicalDataRequestMessageSchema: MessageSchema = {
  $id: `${historicalDataMessageType}:request`,
  description: "Get historical weather data request",
  payload: {
    type: "object",
    required: ["type", "requestId", "payload"],
    properties: {
      type: {
        type: "string",
        const: `${historicalDataMessageType}:request`,
      },
      requestId: {
        description: "Unique request id",
        type: "string",
      },
      payload: {
        type: "object",
        required: ["params"],
        properties: {
          params: {
            type: "object",
            required: ["city", "from", "to", "aggregation"],
            properties: {
              city: {
                type: "string",
              },
              from: {
                type: "string",
              },
              to: {
                type: "string",
              },
              aggregation: {
                enum: ["none", "5m", "30m", "1h"],
              },
            },
          },
        },
      },
    },
  },
};

export const historicalDataResponseMessageSchema: MessageSchema = {
  $id: `${historicalDataMessageType}:response`,
  description: "Get historical weather data response",
  payload: {
    type: "object",
    required: ["type", "requestId", "payload"],
    properties: {
      type: {
        type: "string",
        const: `${historicalDataMessageType}:response`,
      },
      requestId: {
        description: "Unique request id",
        type: "string",
      },
      payload: {
        type: "object",
        properties: {
          result: {
            type: "array",
            items: {
              type: "object",
              required: ["city", "datetime", "weather"],
              properties: {
                city: {
                  type: "string",
                },
                datetime: {
                  type: "string",
                },
                weather: {
                  type: "object",
                  required: [
                    "temperature",
                    "windSpeed",
                    "pressureSurfaceLevel",
                  ],
                  properties: {
                    temperature: {
                      type: "number",
                    },
                    windSpeed: {
                      type: "number",
                    },
                    pressureSurfaceLevel: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "number",
              },
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};
