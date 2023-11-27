import { initDocs } from "./app/docs.js";
import { initRoutes } from "./app/routes.js";
import { app, wsx } from "./app/server.js";
import { initModels } from "./models/index.js";

initModels();
initRoutes(wsx);
initDocs(app, wsx);

process.on("uncaughtException", (error) => {
  console.error("[uncaughtException]", error.stack ?? error.message);
});

process.on("unhandledRejection", (error: any) => {
  console.error(
    "[unhandledRejection]",
    error?.stack ?? error?.message ?? error,
  );
});
