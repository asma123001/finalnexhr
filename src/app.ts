import express from "express";
import path from "node:path";
import cors from "cors";
import helmetModule from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { routes } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();
type HelmetFactory = (options?: { contentSecurityPolicy?: false }) => express.RequestHandler;
const helmetMiddleware =
  (helmetModule as unknown as { default?: HelmetFactory }).default ?? (helmetModule as unknown as HelmetFactory);
app.use(helmetMiddleware({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "6mb" }));
app.use(morgan("dev"));

app.use("/api", routes);
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.static(process.cwd()));
app.use(notFound);
app.use(errorHandler);
