import { Router } from "express";
import upload from "../../config/Multer.config.js";
import { registerOwner } from "../../controllers/owner.controller.js";
import { resendOtp } from "../../controllers/resendotp.controller.js";
import { verifyOtp } from "../../controllers/verifyotp.controller.js";

const router = Router();

router.post("/register", upload.single('profileImage'), registerOwner);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);

export default router;