/**
 * Prayers controller: public random and admin CRUD.
 */
import type { Request, Response, NextFunction } from "express";
import * as prayersService from "./prayers.service.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import type { CreatePrayerBody, UpdatePrayerBody } from "./prayers.validation.js";

/** GET /api/v1/prayers/random - returns one prayer at random. No auth. */
export async function getRandomPrayer(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prayer = await prayersService.getRandomPrayer();
    if (!prayer) {
      sendError(res, "No prayers found", 404);
      return;
    }
    sendSuccess(res, prayer);
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/admin/prayers - list (admin) */
export async function listPrayers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = (req as unknown as { validated?: { query?: { page?: number; limit?: number } } }).validated?.query ?? {};
    const result = await prayersService.listPrayers({ page, limit });
    sendSuccess(res, {
      prayers: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/admin/prayers/:id */
export async function getPrayerById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const prayer = await prayersService.getPrayerById(id);
    if (!prayer) {
      sendError(res, "Prayer not found", 404);
      return;
    }
    sendSuccess(res, prayer);
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/admin/prayers */
export async function createPrayer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = (req as unknown as { validated?: { body?: CreatePrayerBody } }).validated?.body ?? req.body as CreatePrayerBody;
    const prayer = await prayersService.createPrayer(body.text);
    sendSuccess(res, prayer, "Prayer created successfully", 201);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/v1/admin/prayers/:id */
export async function updatePrayer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const body = (req as unknown as { validated?: { body?: UpdatePrayerBody } }).validated?.body ?? req.body as UpdatePrayerBody;
    if (body.text == null) {
      sendError(res, "text is required for update", 400);
      return;
    }
    const prayer = await prayersService.updatePrayer(id, body.text);
    if (!prayer) {
      sendError(res, "Prayer not found", 404);
      return;
    }
    sendSuccess(res, prayer, "Prayer updated successfully");
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/v1/admin/prayers/:id */
export async function deletePrayer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const deleted = await prayersService.deletePrayer(id);
    if (!deleted) {
      sendError(res, "Prayer not found", 404);
      return;
    }
    sendSuccess(res, { deleted: true }, "Prayer deleted successfully");
  } catch (err) {
    next(err);
  }
}
