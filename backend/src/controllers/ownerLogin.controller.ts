import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Owner from "../models/owner/owner.model.js";
import CustomError from "../utils/CustomError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

export const loginOwner = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // 1. Check if user exists
  const owner = await Owner.findOne({ email });
  if (!owner) {
    return next(new CustomError("Email not registered", 404, { attemptedEmail: email }));
  }

  // 2. Check if verified
  if (!owner.isVerify) {
    return res.status(403).json({
      message: "Email not verified. Please verify your email.",
      redirect: "otp-verification",
      email: owner.email,
    });
  }

  // 3. Check password
  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) {
    return next(new CustomError("Invalid password", 401, { attemptedEmail: email }));
  }

  // 4. Generate JWT token (optional, for cookies)
  const token = jwt.sign(
    { id: owner._id, email: owner.email },
    process.env.JWT_SECRET || "yoursecret",
    { expiresIn: "20d" }
  );

  // 5. Set cookie for 20 days
res.cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

  // 6. Respond with user data (omit password)
  res.json({
    message: "Login successful",
    user: {
      id: owner._id,
      email: owner.email,
      fullName: owner.fullName,
      profile: owner.profile,
      plan: owner.plan,
    },
    token,
  });
});