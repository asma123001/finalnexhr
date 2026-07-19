import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { platformRoutes } from "./platform.routes.js";
import { orgRoutes } from "./org.routes.js";

export const routes = Router();
routes.get("/health", (_req, res) => res.json({ ok: true, service: "NexHR API" }));
routes.use("/auth", authRoutes);
routes.use("/platform", platformRoutes);
routes.use("/org", orgRoutes);
