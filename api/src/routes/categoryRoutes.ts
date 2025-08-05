import express from "express";
import Category from "../models/CategoryModel";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data dari database" });
  }
});

export default router;
