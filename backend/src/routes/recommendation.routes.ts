import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { recommendationController } from "../controllers/recommendation.controller";


const router = Router();

router.get("/",authMiddleware,recommendationController)
router.post("/",authMiddleware,recommendationController)

export default router;