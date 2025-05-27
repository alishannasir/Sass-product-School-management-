import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yoursecret") as any;
    req.user = decoded; // Attach user info to request (now typed)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}