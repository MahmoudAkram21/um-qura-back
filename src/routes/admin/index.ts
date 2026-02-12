import { Router } from "express";
import seasonsRoutes from "./seasons.routes.js";
import starsRoutes from "./stars.routes.js";

const router = Router();
router.use("/seasons", seasonsRoutes);
router.use("/stars", starsRoutes);
export default router;
