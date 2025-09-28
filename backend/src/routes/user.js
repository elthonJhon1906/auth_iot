import { authController } from "../controller/auth.js";
import { Router } from "express";
import verifyToken from "../middleware/auth.js"
import authorizeRole from "../middleware/authorization.js";

const router = Router();

router.post("/register", verifyToken, authorizeRole("super_admin"), authController.register);
router.post("/login", authController.login);
router.get("/", verifyToken, authorizeRole("super_admin"), authController.findAll);

export default router;