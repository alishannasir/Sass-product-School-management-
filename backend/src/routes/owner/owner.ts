import { Router } from "express";
import upload from "../../config/Multer.config.js";
import { registerOwner } from "../../controllers/owner/ownerRegistertion.controller.js";
import { resendOtp } from "../../controllers/owner/ownerResendOtp.controller.js";
import { verifyOtp } from "../../controllers/owner/ownerVerificationOtp.controller.js";
import { login } from "../../controllers/Login.controller.js";
import { checkUserMiddleware } from "../../middleware/checkUser.middleware.js";
const router = Router();

router.post("/register", upload.single('profileImage'), registerOwner);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", checkUserMiddleware, login);


export default router;