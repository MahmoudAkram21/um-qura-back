/**
 * Standard API response helpers.
 */
import type { Response } from "express";

export interface ApiSuccessPayload<T> {
  status: true;
  message: string;
  data: T;
}

export interface ApiErrorPayload {
  status: false;
  message: string;
  errors?: unknown;
}

export function sendSuccess<T>(res: Response, data: T, message = "Data retrieved successfully", statusCode = 200): void {
  res.status(statusCode).json({
    status: true,
    message,
    data,
  } as ApiSuccessPayload<T>);
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: unknown): void {
  res.status(statusCode).json({
    status: false,
    message,
    ...(errors != null && { errors }),
  } as ApiErrorPayload);
}
