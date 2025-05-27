import { Router } from "express";
import upload from "../../config/Multer.config.js";
import {registerTeacher} from "../../controllers/teacher/teacherRegistertion.controller.js"
import { verifyTeacherOtp } from "../../controllers/teacher/teacherOtpVerification.js";
import { resendTeacherOtp } from "../../controllers/teacher/teacherResendOtp.controller.js";
import { login } from "../../controllers/Login.controller.js";

const router = Router();

router.post("/register", upload.single('profileImage'), registerTeacher);
router.post("/verify-otp", verifyTeacherOtp);
router.post("/resend-otp",resendTeacherOtp);
router.post("/login",login );

export default router;