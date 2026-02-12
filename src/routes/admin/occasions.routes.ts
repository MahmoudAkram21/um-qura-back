import { Router } from "express";
import * as occasionsController from "../../modules/occasions/occasions.controller.js";
import {
  createOccasionSchema,
  updateOccasionSchema,
  getOccasionParamsSchema,
  listOccasionsQuerySchema,
} from "../../modules/occasions/occasions.validation.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", validate(listOccasionsQuerySchema), occasionsController.listOccasions);
router.get("/:id", validate(getOccasionParamsSchema), occasionsController.getOccasionById);
router.post("/", validate(createOccasionSchema), occasionsController.createOccasion);
router.put("/:id", validate(updateOccasionSchema), occasionsController.updateOccasion);
router.delete("/:id", validate(getOccasionParamsSchema), occasionsController.deleteOccasion);

export default router;
