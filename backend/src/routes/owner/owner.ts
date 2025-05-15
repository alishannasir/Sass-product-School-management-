import Router from "express";
import {registerOwner} from "../../controllers/owner.js"
const router = Router();


router.route("/register").post(registerOwner)

export default router
