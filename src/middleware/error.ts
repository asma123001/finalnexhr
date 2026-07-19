import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/http.js";

export const notFound = () => {
  throw new AppError(404, "Route not found");
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const fields = err.issues.map((issue) => ({
      field: issue.path.filter((part) => part !== "body").join("."),
      message: issue.message
    }));
    res.status(422).json({ error: fields[0]?.message || "Validation failed", details: { fields } });
    return;
  }
  if (err && typeof err === "object" && "code" in err && String((err as { code?: unknown }).code).startsWith("P")) {
    const prismaErr = err as { code?: unknown; meta?: { target?: unknown } };
    if (prismaErr.code === "P2002") {
      const target = Array.isArray(prismaErr.meta?.target) ? prismaErr.meta.target.join(", ") : String(prismaErr.meta?.target || "field");
      res.status(409).json({ error: `This ${target} is already used. Please enter a different value.`, code: prismaErr.code });
      return;
    }
    res.status(409).json({ error: "Database constraint failed. Please check the entered values.", code: err.code });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
