import { Express } from "express";
import { Wsapix } from "wsapix";

export function initDocs(app: Express, wsx: Wsapix) {
  app.get("/docs", (req, res) => {
    res.header("Content-Type", "text/html");
    res.send(wsx.htmlDocTemplate("/api-doc"));
  });

  app.get("/api-doc", (req, res) => {
    res.header("Cache-Control", "no-cache");
    res.json(
      JSON.parse(
        wsx.asyncapi({
          info: {
            version: "0.0.1",
            title: "Weather service API",
          },
        }),
      ),
    );
  });
}
