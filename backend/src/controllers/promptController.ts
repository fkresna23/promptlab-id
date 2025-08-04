import { Request, Response } from "express";
import Prompt from "../models/PromptModel";
import mongoose from "mongoose";

export const getPromptsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(404).json({ message: "Category not found" });
    }
    const prompts = await Prompt.find({ category: categoryId }).select(
      "title description isPremium"
    );
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPromptById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    const prompt = await Prompt.findById(req.params.id);

    if (prompt) {
      // Jika prompt adalah premium, cek peran pengguna
      if (prompt.isPremium) {
        // req.user akan tersedia karena middleware 'protect'
        if (
          req.user &&
          (req.user.role === "premium" || req.user.role === "admin")
        ) {
          res.json(prompt); // Pengguna premium, kirim data lengkap
        } else {
          // Pengguna bukan premium, kirim 403 Forbidden
          return res.status(403).json({
            message: "You need a premium plan to access this prompt.",
          });
        }
      } else {
        res.json(prompt); // Prompt gratis, kirim data lengkap
      }
    } else {
      res.status(404).json({ message: "Prompt not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
