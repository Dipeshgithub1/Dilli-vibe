import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { onboardingController } from "../controllers/user.controller";


const router = Router();

//onboarding 

router.patch("/onboarding", authMiddleware, onboardingController)


export default router;