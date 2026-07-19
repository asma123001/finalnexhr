import { login } from "../services/auth.service.js";
import { asyncHandler } from "../utils/http.js";
import { UserRole } from "../utils/auth.js";

export const loginController = asyncHandler(async (req, res) => {
  const result = await login(req.body.email, req.body.password, req.body.role as UserRole | undefined);
  res.json(result);
});

export const meController = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
