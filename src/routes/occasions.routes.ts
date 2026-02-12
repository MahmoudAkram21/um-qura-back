/**
 * Public occasions: GET display sections (no auth).
 */
import { Router } from "express";
import * as occasionsController from "../modules/occasions/occasions.controller.js";

const router = Router();
router.get("/", occasionsController.getOccasionsForDisplay);

export default router;
