/**
 * Require valid JWT for admin routes.
 * Expects Authorization: Bearer <token>.
 */
import type { Request, Response, NextFunction } from "express";
import * as authService from "../modules/auth/auth.service.js";
import { sendError } from "../utils/apiResponse.js";

export interface AuthPayload {
  adminId: number;
  email: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    sendError(res, "Authorization required", 401);
    return;
  }
  const token = header.slice(7);
  try {
    const payload = authService.verifyToken(token);
    (req as Request & { auth: AuthPayload }).auth = {
      adminId: Number(payload.sub),
      email: payload.email,
    };
    next();
  } catch {
    sendError(res, "Invalid or expired token", 401);
  }
}
