/**
 * Public prayers: GET random. No auth.
 */
import { Router } from "express";
import * as prayersController from "../modules/prayers/prayers.controller.js";

const router = Router();
router.get("/random", prayersController.getRandomPrayer);

export default router;
