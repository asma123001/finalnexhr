import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/http.js";

export const notFound = () => {
  throw new AppError(404, "Route not found");
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(422).json({ error: "Validation failed", details: err.flatten() });
    return;
  }
  if (err && typeof err === "object" && "code" in err && String((err as { code?: unknown }).code).startsWith("P")) {
    res.status(409).json({ error: "Database constraint failed", code: err.code });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
