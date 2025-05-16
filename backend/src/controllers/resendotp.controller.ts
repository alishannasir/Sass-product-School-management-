import { Request, Response, NextFunction } from 'express';
import GenerateOTP from "../utils/GenerateOtp.js";
import SendEmail from "../utils/SendEmail.js";
import emailHtmlTemplate from "../utils/EmailHTMLTemplate.js";
import Otp from "../models/otp/otp.model.js";
import Owner from "../models/owner/owner.model.js";
import CustomError from "../utils/CustomError.js";
import AsyncHandler from "../utils/AsyncHandler.js";


export const resendOtp = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { email } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) return next(new CustomError("Email not found", 404, { attemptedEmail: email }));
    if (owner.isVerify) return next(new CustomError("User already verified", 400, { attemptedEmail: email }));

    let otpDoc = await Otp.findOne({ email: owner._id }).sort({ createdAt: -1 });

    // Rate limit: Only allow resend after 1 minute
    if (otpDoc && otpDoc.otpExpiry > new Date()) {
      const now = Date.now();
      const lastSent = otpDoc.lastOtpSentAt.getTime();
      if (now - lastSent < 60 * 1000) {
        return next(new CustomError("Please wait before requesting another OTP.", 429, { attemptedEmail: email }));
      }
    }

    // Generate new OTP and update/create doc
    const newOtp = GenerateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const lastOtpSentAt = new Date();

    if (otpDoc) {
      otpDoc.otp = newOtp;
      otpDoc.otpExpiry = otpExpiry;
      otpDoc.lastOtpSentAt = lastOtpSentAt;
      await otpDoc.save();
    } else {
      await Otp.create({
        email: owner._id,
        otp: newOtp,
        otpExpiry,
        lastOtpSentAt,
      });
    }

    const result = await SendEmail(owner.email, "OTP resend verification", emailHtmlTemplate(owner.fullName, newOtp));
    if (!result) {
      return next(new CustomError("Email not sent", 500, { attemptedEmail: email }));
    }

    res.json({
      message: "Otp resent successfully",
      status: 1,
    });
  } catch (error) {
    next(error);
  }
});