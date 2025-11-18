import { Router } from "express";
import { summary } from "../controllers/reports.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

// Public route (for quick test)
router.get("/public/summary", summary);

// Protected routes
router.use(authRequired);
router.get("/summary", summary);

export default router;
