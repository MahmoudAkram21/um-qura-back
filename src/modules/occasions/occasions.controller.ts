/**
 * Occasions controller: admin CRUD and public display.
 */
import type { Request, Response, NextFunction } from "express";
import * as occasionsService from "./occasions.service.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import type { CreateOccasionBody, UpdateOccasionBody } from "./occasions.validation.js";

/** GET /api/v1/occasions - public: sections for display */
export async function getOccasionsForDisplay(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await occasionsService.getOccasionsForDisplay();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/admin/occasions - list (admin) */
export async function listOccasions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = (req as unknown as { validated?: { query?: { page?: number; limit?: number } } }).validated?.query ?? {};
    const result = await occasionsService.listOccasions({ page, limit });
    sendSuccess(res, {
      occasions: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/admin/occasions/:id */
export async function getOccasionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const occasion = await occasionsService.getOccasionById(id);
    if (!occasion) {
      sendError(res, "Occasion not found", 404);
      return;
    }
    sendSuccess(res, occasion);
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/admin/occasions */
export async function createOccasion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = (req as unknown as { validated?: { body?: CreateOccasionBody } }).validated?.body ?? req.body as CreateOccasionBody;
    const occasion = await occasionsService.createOccasion({
      hijriMonth: body.hijriMonth,
      hijriDay: body.hijriDay,
      title: body.title,
      prayerTitle: body.prayerTitle,
      prayerText: body.prayerText,
    });
    sendSuccess(res, occasion, "Occasion created successfully", 201);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/v1/admin/occasions/:id */
export async function updateOccasion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const body = (req as unknown as { validated?: { body?: UpdateOccasionBody } }).validated?.body ?? req.body as UpdateOccasionBody;
    const occasion = await occasionsService.updateOccasion(id, {
      hijriMonth: body.hijriMonth,
      hijriDay: body.hijriDay,
      title: body.title,
      prayerTitle: body.prayerTitle,
      prayerText: body.prayerText,
    });
    if (!occasion) {
      sendError(res, "Occasion not found", 404);
      return;
    }
    sendSuccess(res, occasion, "Occasion updated successfully");
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/v1/admin/occasions/:id */
export async function deleteOccasion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const deleted = await occasionsService.deleteOccasion(id);
    if (!deleted) {
      sendError(res, "Occasion not found", 404);
      return;
    }
    sendSuccess(res, { deleted: true }, "Occasion deleted successfully");
  } catch (err) {
    next(err);
  }
}
