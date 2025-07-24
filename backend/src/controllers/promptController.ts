import { Request, Response } from "express";
import Prompt from "../models/PromptModel";
import mongoose from "mongoose";

export const getPromptsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(404).json({ message: "Category not found" });
    }
    const prompts = await Prompt.find({ category: categoryId });
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
      res.json(prompt);
    } else {
      res.status(404).json({ message: "Prompt not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
