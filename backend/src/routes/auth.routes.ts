import { Router } from "express";
import { registerController,loginController,refreshController,logoutController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { meController } from "../controllers/meController";

const router = Router();

//Register
router.post("/register",registerController)

//login
router.post("/login",loginController)

router.post("/refresh",refreshController)

router.post("/logout",logoutController);


router.get("/me", authMiddleware, meController);





export default router;