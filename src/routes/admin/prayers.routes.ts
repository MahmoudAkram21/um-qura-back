import { Router } from "express";
import * as prayersController from "../../modules/prayers/prayers.controller.js";
import {
  createPrayerSchema,
  updatePrayerSchema,
  getPrayerParamsSchema,
  listPrayersQuerySchema,
} from "../../modules/prayers/prayers.validation.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", validate(listPrayersQuerySchema), prayersController.listPrayers);
router.get("/:id", validate(getPrayerParamsSchema), prayersController.getPrayerById);
router.post("/", validate(createPrayerSchema), prayersController.createPrayer);
router.put("/:id", validate(updatePrayerSchema), prayersController.updatePrayer);
router.delete("/:id", validate(getPrayerParamsSchema), prayersController.deletePrayer);

export default router;
