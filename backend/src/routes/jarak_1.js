import { jarak_1_controller } from "../controller/jarak_1.js";
import verifyToken from "../middleware/auth.js"
import authorizationRole from "../middleware/authorization.js"
import {Router} from "express"

const router = Router();

router.get("/", verifyToken, authorizationRole("admin_jarak_1", "super_admin"),jarak_1_controller.findAll);
router.post("/", jarak_1_controller.create);

export default router;