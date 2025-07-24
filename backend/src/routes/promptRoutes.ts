import express from "express";
import {
  getPromptsByCategory,
  getPromptById,
} from "../controllers/promptController";
const router = express.Router();

router.get("/category/:categoryId", getPromptsByCategory);
router.get("/:id", getPromptById); // Rute baru

export default router;
