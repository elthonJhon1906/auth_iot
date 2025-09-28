import controller from "../controller/controller.js"
import {Router} from "express"
import verifyToken from "../middleware/auth.js"
import authorizationRole from "../middleware/authorization.js"
const router = Router();

router.get("/", controller.findAll);
router.post("/", verifyToken, authorizationRole("super_admin"), controller.create);

export default router;