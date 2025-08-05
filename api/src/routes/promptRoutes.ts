import express from "express";
import {
  getPromptsByCategory,
  getPromptById,
  getAllPrompts,
  createPrompt,
} from "../controllers/promptController";
import { protect } from "../middleware/authMiddleware";
import { admin } from "../middleware/adminMiddleware";

const router = express.Router();

// Public route to get prompts list for a category
router.get("/category/:categoryId", getPromptsByCategory);

// Admin route to get all prompts
router.get("/all", protect, admin, getAllPrompts);

// Private route to get a single prompt detail (premium or free)
router.get("/:id", protect, getPromptById);

// Admin route to create a new prompt
router.post("/", protect, admin, createPrompt);

export default router;
