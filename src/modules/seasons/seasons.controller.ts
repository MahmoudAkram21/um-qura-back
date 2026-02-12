/**
 * Seasons controller: admin CRUD.
 */
import type { Request, Response, NextFunction } from "express";
import * as seasonsService from "./seasons.service.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";
import type { CreateSeasonBody, UpdateSeasonBody } from "./seasons.validation.js";

export async function listSeasons(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await seasonsService.listSeasons();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as Request & { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const season = await seasonsService.getSeasonById(id);
    if (!season) {
      sendError(res, "Season not found", 404);
      return;
    }
    sendSuccess(res, season);
  } catch (err) {
    next(err);
  }
}

export async function createSeason(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = (req as Request & { validated?: { body?: CreateSeasonBody } }).validated?.body ?? req.body as CreateSeasonBody;
    const season = await seasonsService.createSeason(body);
    sendSuccess(res, season, "Season created", 201);
  } catch (err) {
    next(err);
  }
}

export async function updateSeason(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as Request & { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    const body = (req as Request & { validated?: { body?: UpdateSeasonBody } }).validated?.body ?? req.body as UpdateSeasonBody;
    const season = await seasonsService.updateSeason(id, body);
    sendSuccess(res, season, "Season updated");
  } catch (err) {
    next(err);
  }
}

export async function deleteSeason(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (req as Request & { validated?: { params?: { id: number } } }).validated?.params?.id ?? Number((req as Request & { params: { id: string } }).params.id);
    await seasonsService.deleteSeason(id);
    sendSuccess(res, { deleted: true }, "Season deleted");
  } catch (err) {
    next(err);
  }
}
