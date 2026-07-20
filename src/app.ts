import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { routes } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "6mb" }));
app.use(morgan("dev"));

app.use("/api", routes);
app.use(express.static(process.cwd()));
app.use(notFound);
app.use(errorHandler);
