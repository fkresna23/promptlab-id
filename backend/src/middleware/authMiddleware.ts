import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/UserModel";

// Menambahkan properti 'user' ke interface Request Express
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        // Jika user tidak ditemukan (misalnya sudah dihapus), kirim error
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      return next(); // Lanjutkan ke middleware/controller berikutnya
    } catch (error) {
      console.error("Token verification failed:", error);
      // Jika token gagal diverifikasi, kirim error
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // Jika tidak ada token sama sekali, kirim error
  return res.status(401).json({ message: "Not authorized, no token" });
};

export const premiumAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "premium") {
    next();
  } else {
    res.status(403).json({ message: "Premium access required" });
  }
};
