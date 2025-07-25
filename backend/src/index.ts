import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import promptRoutes from "./routes/promptRoutes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// PERBAIKAN: Konfigurasi CORS yang lebih spesifik
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Izinkan URL dari Vercel atau localhost
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prompts", promptRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Selamat datang di API Prompt Library!" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
