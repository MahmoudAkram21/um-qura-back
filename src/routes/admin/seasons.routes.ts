import { Router } from "express";
import * as seasonsController from "../../modules/seasons/seasons.controller.js";
import {
  createSeasonSchema,
  updateSeasonSchema,
  getSeasonParamsSchema,
} from "../../modules/seasons/seasons.validation.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", seasonsController.listSeasons);
router.get("/:id", validate(getSeasonParamsSchema), seasonsController.getSeasonById);
router.post("/", validate(createSeasonSchema), seasonsController.createSeason);
router.put("/:id", validate(updateSeasonSchema), seasonsController.updateSeason);
router.delete("/:id", validate(getSeasonParamsSchema), seasonsController.deleteSeason);

export default router;
