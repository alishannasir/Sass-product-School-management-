import { Request, Response, NextFunction } from 'express';
import Otp from "../../models/otp/otp.model.js";
import Owner from "../../models/owner/owner.model.js";
import CustomError from "../../utils/CustomError.js";
import AsyncHandler from "../../utils/AsyncHandler.js";


export const verifyOtp = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { otp, email } = req.body;

  console.log("OTP Verification Request:", req.body);

  // Check if email exists
  const owner = await Owner.findOne({ email });
  if (!owner) {
    return next(new CustomError("Email not found", 404, { attemptedEmail: email }));
  }

  // Check if already verified
  if (owner.isVerify) {
    return next(new CustomError("Already verified", 400, { attemptedEmail: email }));
  }

  // Find OTP data
  const otpData = await Otp.findOne({ email: owner._id });
  if (!otpData) {
    return next(new CustomError("Otp not found", 404, { attemptedEmail: email }));
  }

  // Check OTP expiry
  if (otpData.otpExpiry < new Date()) {
    return next(new CustomError("Otp expired", 400, { attemptedEmail: email }));
  }

  // Check OTP match
  if (otpData.otp !== otp) {
    return next(new CustomError("Otp not matched", 400, { attemptedEmail: email }));
  }

  // Mark owner as verified
  await Owner.updateOne({ _id: owner._id }, { isVerify: true });

  // Clear OTP
  await Otp.deleteOne({ email: owner._id });

  res.json({
    message: "OTP VERIFIED SUCCESSFULLY",
    status: 1,
  });
});