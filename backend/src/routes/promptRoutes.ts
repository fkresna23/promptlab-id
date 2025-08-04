import express from "express";
import {
  getPromptsByCategory,
  getPromptById,
} from "../controllers/promptController";
import { protect } from "../middleware/authMiddleware"; // Impor middleware

const router = express.Router();

router.get("/category/:categoryId", getPromptsByCategory);
// Gunakan middleware 'protect' di sini.
router.get("/:id", protect, getPromptById);

export default router;
