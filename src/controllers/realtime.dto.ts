import { MessageSchema } from "wsapix";

const realtimeSubscribeMessageType = "realtime:subscribe";
const realtimeDataMessageType = "realtime:data";

export interface RealtimeSubscribeRequestMessagePayload {
  type: "realtime:subscribe:request";
  requestId: string;
  payload: {
    params: {
      city: string;
    };
  };
}

export const realtimeSubscribeRequestMessageSchema: MessageSchema = {
  $id: `${realtimeSubscribeMessageType}:request`,
  description: "Subscribe for real-time weather data request",
  payload: {
    type: "object",
    required: ["type", "requestId", "payload"],
    properties: {
      type: {
        type: "string",
        const: `${realtimeSubscribeMessageType}:request`,
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
            required: ["city"],
            properties: {
              city: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

export const realtimeSubscribeResponseMessageSchema: MessageSchema = {
  $id: `${realtimeSubscribeMessageType}:response`,
  description: "Subscribe for real-time weather data response",
  payload: {
    type: "object",
    required: ["type", "requestId", "payload"],
    properties: {
      type: {
        type: "string",
        const: `${realtimeSubscribeMessageType}:response`,
      },
      requestId: {
        description: "Unique request id",
        type: "string",
      },
      payload: {
        type: "object",
        properties: {
          result: {
            type: "string",
            const: "ok",
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

export const realtimeDataMessageSchema: MessageSchema = {
  $id: realtimeDataMessageType,
  description: "Real-time weather data",
  payload: {
    type: "object",
    required: ["type", "payload"],
    properties: {
      type: {
        type: "string",
        const: realtimeDataMessageType,
      },
      payload: {
        type: "object",
        required: ["result"],
        properties: {
          result: {
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
                required: ["temperature", "windSpeed", "pressureSurfaceLevel"],
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
      },
    },
  },
};
