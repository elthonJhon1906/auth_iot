import Router from "express"
import jarak_2_controller from "../controller/jarak_2.js"
import verifyToken from "../middleware/auth.js"
import authorizationRole from "../middleware/authorization.js"
const router = new Router();

router.get("/", verifyToken, authorizationRole("admin_jarak_2", "super_admin"), jarak_2_controller.findAll);
router.post("/", jarak_2_controller.create);

export default router;