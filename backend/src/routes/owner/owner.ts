import { Router } from "express";
import upload from "../../config/Multer.config.js";
import { registerOwner } from "../../controllers/ownerRegistertion.controller.js";
import { resendOtp } from "../../controllers/resendotp.controller.js";
import { verifyOtp } from "../../controllers/verifyotp.controller.js";
import { loginOwner } from "../../controllers/ownerLogin.controller.js";

const router = Router();

router.post("/register", upload.single('profileImage'), registerOwner);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginOwner);


export default router;