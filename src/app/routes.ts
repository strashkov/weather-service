import { Wsapix } from "wsapix";
import { realtimeData } from "../controllers/realtime.controller.js";
import { historicalData } from "../controllers/historical.controller.js";

export function initRoutes(wsx: Wsapix) {
  realtimeData(wsx.route("/realtime"));
  historicalData(wsx.route("/historical"));
}
