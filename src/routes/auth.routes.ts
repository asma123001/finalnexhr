import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../schemas.js";
import { loginController, meController } from "../controllers/auth.controller.js";

export const authRoutes = Router();
authRoutes.post("/login", validate(loginSchema), loginController);
authRoutes.get("/me", authenticate, meController);
