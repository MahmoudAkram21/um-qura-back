import { Router } from "express";
import * as starsController from "../../modules/stars/stars.controller.js";
import {
  createStarSchema,
  updateStarSchema,
  getStarParamsSchema,
  listStarsQuerySchema,
} from "../../modules/stars/stars.validation.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", validate(listStarsQuerySchema), starsController.listStars);
router.get("/:id", validate(getStarParamsSchema), starsController.getStarById);
router.post("/", validate(createStarSchema), starsController.createStar);
router.put("/:id", validate(updateStarSchema), starsController.updateStar);
router.delete("/:id", validate(getStarParamsSchema), starsController.deleteStar);

export default router;
