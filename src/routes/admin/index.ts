import { Router } from "express";
import seasonsRoutes from "./seasons.routes.js";
import starsRoutes from "./stars.routes.js";
import occasionsRoutes from "./occasions.routes.js";
import prayersRoutes from "./prayers.routes.js";

const router = Router();
router.use("/seasons", seasonsRoutes);
router.use("/stars", starsRoutes);
router.use("/occasions", occasionsRoutes);
router.use("/prayers", prayersRoutes);
export default router;
