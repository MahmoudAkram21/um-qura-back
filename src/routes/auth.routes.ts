import { Router } from "express";
import * as authController from "../modules/auth/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../modules/auth/auth.validation.js";

const router = Router();
router.post("/login", validate(loginSchema), authController.login);
export default router;
