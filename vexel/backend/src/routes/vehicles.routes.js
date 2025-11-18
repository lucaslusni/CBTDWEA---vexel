import { Router } from "express";
import { list, getById, create, update, remove, checkUp, efficiency } from "../controllers/vehicles.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

// Uncomment if you want public test endpoints
// router.get("/public/check-up", checkUp);
// router.get("/public/efficiency", efficiency);

// Everything below requires authentication
router.use(authRequired);

// Specific routes first
router.get("/check-up/all", checkUp);
router.get("/efficiency/all", efficiency);

// Generic CRUD
router.get("/", list);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
