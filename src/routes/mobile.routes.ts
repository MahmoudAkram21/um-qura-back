/**
 * Mobile app: read-only API. No auth required.
 * GET only - no create, update, or delete.
 */
import { Router } from "express";
import * as starsController from "../modules/stars/stars.controller.js";
import { getStarParamsSchema, listStarsQuerySchema } from "../modules/stars/stars.validation.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Calendar: nested seasons + stars (same as public)
router.get("/calendar", starsController.getCalendar);

// List stars (paginated, read-only)
router.get("/stars", validate(listStarsQuerySchema), starsController.listStars);

// Current star (today's date) - must be before /stars/:id
router.get("/stars/current", starsController.getCurrentStar);

// Single star (read-only)
router.get("/stars/:id", validate(getStarParamsSchema), starsController.getStarById);

export default router;
