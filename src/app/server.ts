import * as http from "http";
import express, { Express } from "express";
import { Wsapix } from "wsapix";
import Ajv from "ajv";

const port = Number(process.env.PORT || 3000);
export const app = express();
const server = new http.Server(app);

server.listen(port, () => {
  console.log(`Server listen port ${port}`);
});

const ajv = new Ajv.default({ strict: "log", strictTypes: "log" });

export const wsx = Wsapix.WS(
  { server },
  {
    validator: (schema, data, error) => {
      const validate = ajv.compile(schema);

      if (validate(data)) {
        return true;
      }

      error(
        validate
          .errors!.map(
            ({ message, instancePath }) => `${instancePath}: ${message}`,
          )
          .join(",\n"),
      );
      return false;
    },
  },
);

wsx.on("error", (_, message) => {
  console.log("wsx.onerror", message);
});
