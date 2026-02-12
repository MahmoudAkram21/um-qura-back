/**
 * 404 Not Found middleware.
 */
import type { Request, Response } from "express";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({
    status: false,
    message: "Resource not found",
  });
}
