import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Owner from "../models/owner/owner.model.js";
import Teacher from "../models/teacher/teacher.model.js";
// import Student from "../../models/student/student.model.js"; // Uncomment and import
// import Parent from "../../models/parent/parent.model.js";   // If you have Parent model
import CustomError from "../utils/CustomError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const roleModelMap: Record<string, any> = {
  Owner,
  Teacher,
  // Student,
  // Parent,
};

export const login = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let { email, password, role } = req.body;

  console.log("Login request body:", req.body);

  if (role) {
    role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
  const Model = roleModelMap[role];
  if (!Model) {
    return next(new CustomError("Invalid role", 400, { attemptedRole: role }));
  }
  
  // 1. Check if user exists in the correct collection
 const user = await Model.findOne({ email }).select("+password");
 console.log("User found:", user);
  if (!user.password) {
    return next(new CustomError(" password missing", 404, { attemptedEmail: email }));
  }
  if (!user) {
    return next(new CustomError("Email not registered ", 405, { attemptedEmail: email }));
  }

  // 2. Check if verified
  if (!user.isVerify) {
    return res.status(403).json({
      message: "Email not verified. Please verify your email.",
      redirect: "otp-verification",
      email: user.email,
    });
  }

  // 3. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new CustomError("Invalid password", 401, { attemptedEmail: email }));
  }

  // 4. Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "yoursecret",
    { expiresIn: "20d" }
  );

  // 5. Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // 6. Respond with user data (omit password)
  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profile: user.profile,
      plan: user.plan,
      role: user.role,
    },
    token,
  });
});