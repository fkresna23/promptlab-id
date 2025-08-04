import { Request, Response } from "express";
import Prompt from "../models/PromptModel";
import mongoose from "mongoose";

// ... (fungsi getPromptsByCategory, getPromptById, getAllPrompts tetap sama) ...
// @desc    Get prompts by category for public view
// @route   GET /api/prompts/category/:categoryId
// @access  Public
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
    console.error("Error in getPromptsByCategory:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a single prompt by ID
// @route   GET /api/prompts/:id
// @access  Private (requires token)
export const getPromptById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    const prompt = await Prompt.findById(req.params.id);

    if (prompt) {
      if (prompt.isPremium) {
        if (
          req.user &&
          (req.user.role === "premium" || req.user.role === "admin")
        ) {
          res.json(prompt);
        } else {
          return res.status(403).json({
            message: "You need a premium plan to access this prompt.",
          });
        }
      } else {
        res.json(prompt);
      }
    } else {
      res.status(404).json({ message: "Prompt not found" });
    }
  } catch (error) {
    console.error("Error in getPromptById:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all prompts for admin view
// @route   GET /api/prompts/all
// @access  Private/Admin
export const getAllPrompts = async (req: Request, res: Response) => {
  try {
    const prompts = await Prompt.find({})
      .populate("category", "title")
      .sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    console.error("Error in getAllPrompts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new prompt
// @route   POST /api/prompts
// @access  Private/Admin
export const createPrompt = async (req: Request, res: Response) => {
  try {
    // Middleware 'protect' sudah memastikan req.user ada
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      title,
      description,
      promptText,
      category,
      isPremium,
      whatItDoes,
      tips,
      howToUse,
    } = req.body;

    // Validasi input yang lebih ketat
    if (!title || !description || !promptText || !category) {
      return res.status(400).json({
        message: "Judul, deskripsi, teks prompt, dan kategori wajib diisi.",
      });
    }

    const prompt = new Prompt({
      user: req.user._id,
      title,
      description,
      promptText,
      category,
      isPremium,
      whatItDoes: whatItDoes || [],
      tips: tips || [],
      howToUse: howToUse || [],
    });

    const createdPrompt = await prompt.save();
    res.status(201).json(createdPrompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      // Mengambil pesan error pertama dari validasi Mongoose
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error saat membuat prompt." });
  }
};
