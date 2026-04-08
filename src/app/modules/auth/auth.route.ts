import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router();

// Endpoint: /api/v1/auth/register
router.post("/register", authController.register);

// Endpoint: /api/v1/auth/login
router.post("/login", authController.login);

export default router;