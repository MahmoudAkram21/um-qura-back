/**
 * Stars controller: HTTP layer for calendar and admin CRUD.
 */
import type { Request, Response, NextFunction } from "express";
import * as starsService from "./stars.service.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import type { CreateStarBody, UpdateStarBody } from "./stars.validation.js";

/** GET /api/v1/stars/calendar */
export async function getCalendar(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await starsService.getCalendar();
    sendSuccess(res, data, "Data retrieved successfully");
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/stars (admin, paginated) */
export async function listStars(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, seasonId } = (req as unknown as { validated?: { query?: { page?: number; limit?: number; seasonId?: number } } }).validated?.query ?? {};
    const result = await starsService.listStars({ page, limit, seasonId });
    sendSuccess(res, {
      stars: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/mobile/stars/current - star containing today's date. */
export async function getCurrentStar(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const star = await starsService.getCurrentStar();
    if (!star) {
      sendError(res, "No star found for today's date", 404);
      return;
    }
    sendSuccess(res, star);
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/stars/:id */
export async function getStarById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const star = await starsService.getStarById(id);
    if (!star) {
      sendError(res, "Star not found", 404);
      return;
    }
    sendSuccess(res, star);
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/stars */
export async function createStar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = (req as unknown as { validated?: { body?: CreateStarBody } }).validated?.body ?? req.body as CreateStarBody;
    const startDate = typeof body.startDate === "string" && body.startDate.length <= 10
      ? new Date(body.startDate + "T00:00:00.000Z")
      : new Date(body.startDate);
    const endDate = typeof body.endDate === "string" && body.endDate.length <= 10
      ? new Date(body.endDate + "T00:00:00.000Z")
      : new Date(body.endDate);
    const star = await starsService.createStar({
      seasonId: body.seasonId,
      name: body.name,
      startDate,
      endDate,
      description: body.description,
      weatherInfo: body.weatherInfo,
      agriculturalInfo: body.agriculturalInfo,
      tips: body.tips,
    });
    sendSuccess(res, star, "Star created successfully", 201);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/v1/stars/:id */
export async function updateStar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const body = (req as unknown as { validated?: { body?: UpdateStarBody } }).validated?.body ?? req.body as UpdateStarBody;
    const startDate = body.startDate
      ? (typeof body.startDate === "string" && body.startDate.length <= 10 ? new Date(body.startDate + "T00:00:00.000Z") : new Date(body.startDate))
      : undefined;
    const endDate = body.endDate
      ? (typeof body.endDate === "string" && body.endDate.length <= 10 ? new Date(body.endDate + "T00:00:00.000Z") : new Date(body.endDate))
      : undefined;
    const star = await starsService.updateStar(id, {
      name: body.name,
      startDate,
      endDate,
      description: body.description,
      weatherInfo: body.weatherInfo,
      agriculturalInfo: body.agriculturalInfo,
      tips: body.tips,
    });
    sendSuccess(res, star, "Star updated successfully");
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/v1/stars/:id */
export async function deleteStar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as unknown as { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    await starsService.deleteStar(id);
    sendSuccess(res, { deleted: true }, "Star deleted successfully");
  } catch (err) {
    next(err);
  }
}
