import { Router } from "express";
import { registerController,loginController,logoutController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { meController } from "../controllers/meController";

const router = Router();

//Register
router.post("/register",registerController)

//login
router.post("/login",loginController)

router.post("/logout", authMiddleware, logoutController);


router.get("/me", authMiddleware, meController);





export default router;