import { Request, Response, NextFunction } from "express";

export const admin = (req: Request, res: Response, next: NextFunction) => {
  // Middleware ini harus dijalankan setelah middleware 'protect'
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
