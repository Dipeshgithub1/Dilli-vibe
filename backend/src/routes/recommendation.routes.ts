import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { recommendationController, getPlaceController, getRelatedPlacesController } from "../controllers/recommendation.controller";


const router = Router();

router.get("/",authMiddleware,recommendationController)
router.post("/",authMiddleware,recommendationController)
router.get("/place/:id",authMiddleware,getPlaceController)
router.get("/:id",authMiddleware,getPlaceController)
router.get("/related/:id",authMiddleware,getRelatedPlacesController)

export default router;