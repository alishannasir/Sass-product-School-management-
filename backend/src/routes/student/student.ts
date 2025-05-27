import { Router } from "express";
import upload from "../../config/Multer.config.js";
import { login } from "../../controllers/Login.controller.js";
import { registerStudent} from "../../controllers/student/studentRegisteration.js"

const router = Router();

router.post("/register", upload.single('profileImage'), registerStudent);
// router.post("/resend-otp", );
// router.post("/verify-otp", );
router.post("/login", login);


export default router;