import {userController} from "../controller/user.js"
import { Router } from "express";
import verifyToken from "../middleware/auth.js"
import authorizeRole from "../middleware/authorization.js";

const router = Router();

router.post("/register", verifyToken, authorizeRole("super_admin"), userController.register);
router.post("/login", userController.login);
router.get("/", verifyToken, authorizeRole("super_admin"), userController.findAll);
router.get("/:id", verifyToken, authorizeRole("super_admin"), userController.findLog);
router.patch("/:id", verifyToken, authorizeRole("super_admin"), userController.update);
export default router;