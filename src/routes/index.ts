/**
 * API route aggregator.
 * - Public: /v1/stars/calendar (web + mobile)
 * - Mobile (read-only): /v1/mobile/*
 * - Auth: /v1/auth/login
 * - Admin (JWT): /v1/admin/*
 */
import { Router } from "express";
import starsRoutes from "./stars.routes.js";
import authRoutes from "./auth.routes.js";
import mobileRoutes from "./mobile.routes.js";
import adminRoutes from "./admin/index.js";

const router = Router();

// Public calendar (backward compatible; also used by mobile)
router.use("/v1/stars", starsRoutes);

router.use("/v1/auth", authRoutes);
router.use("/v1/mobile", mobileRoutes);
router.use("/v1/admin", adminRoutes);

export default router;
