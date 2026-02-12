/**
 * Stars: public calendar only (GET /calendar).
 * Admin CRUD moved to /v1/admin/stars (requires JWT).
 */
import { Router } from "express";
import * as starsController from "../modules/stars/stars.controller.js";

const router = Router();
router.get("/calendar", starsController.getCalendar);
export default router;
