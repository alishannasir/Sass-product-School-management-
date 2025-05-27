import { Request, Response, NextFunction } from 'express';
import Owner from "../models/owner/owner.model.js";
import Teacher from "../models/teacher/teacher.model.js";
// import Student from "../models/student/student.model.js";
// import Parent from "../models/parent/parent.model.js";
import AsyncHandler from "../utils/AsyncHandler.js"; // Import AsyncHandler

const roleModelMap: Record<string, any> = {
  Owner,
  Teacher,
  // Student,
  // Parent,
};

const checkUserMiddleware = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ message: "Email and role required" });
  }
  const Model = roleModelMap[role];
  if (!Model) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const user = await Model.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!user.isVerify) {
    return res.status(403).json({ message: "User not verified" });
  }
  // Attach user to request for next middleware/controller
  (req as any).user = user;
  next();
});

export { checkUserMiddleware };