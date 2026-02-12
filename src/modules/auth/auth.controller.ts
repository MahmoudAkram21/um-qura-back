/**
 * Auth controller: login endpoint.
 */
import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import type { LoginBody } from "./auth.validation.js";

/** POST /api/v1/auth/login */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = (req as Request & { validated?: { body?: LoginBody } }).validated?.body ?? req.body as LoginBody;
    const result = await authService.login(body.email, body.password);
    if (!result) {
      sendError(res, "Invalid email or password", 401);
      return;
    }
    sendSuccess(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
}
