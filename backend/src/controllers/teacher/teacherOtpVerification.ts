import { Request, Response, NextFunction } from 'express';
import Teacher from '../../models/teacher/teacher.model.js';
import Otp from '../../models/otp/otp.model.js';
import CustomError from '../../utils/CustomError.js';
import AsyncHandler from "../../utils/AsyncHandler.js";
import cleanOtp from "../../helper/CleanOtp.js";

export const verifyTeacherOtp = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return next(new CustomError("Teacher not found", 404, { attemptedEmail: email }));
    if (teacher.isVerify) return next(new CustomError("Teacher already verified", 400, { attemptedEmail: email }));

    const otpDoc = await Otp.findOne({ email: teacher._id }).sort({ createdAt: -1 });
    if (!otpDoc) return next(new CustomError("OTP not found", 404, { attemptedEmail: email }));

    if (otpDoc.otp !== otp) return next(new CustomError("Invalid OTP", 400, { attemptedEmail: email }));
    if (otpDoc.otpExpiry < new Date()) return next(new CustomError("OTP expired", 400, { attemptedEmail: email }));

    teacher.isVerify = true;
    await teacher.save();

await cleanOtp(teacher._id, teacher.role);

    res.json({
      message: "Teacher verified successfully",
      status: 1,
    });
  } catch (error) {
    next(error);
  }
});