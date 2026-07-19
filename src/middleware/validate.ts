import { AnyZodObject } from "zod";
import { RequestHandler } from "express";
import { asyncHandler } from "../utils/http.js";

export function validate(schema: AnyZodObject): RequestHandler {
  return asyncHandler(async (req, _res, next) => {
    const parsed = await schema.parseAsync({ body: req.body, params: req.params, query: req.query });
    req.body = parsed.body ?? req.body;
    req.params = parsed.params ?? req.params;
    req.query = parsed.query ?? req.query;
    next();
  });
}
