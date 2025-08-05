import express from "express";
import cors, { CorsOptions } from "cors";
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

const allowedOrigins: (string | RegExp)[] = [
  "http://localhost:5173",
  process.env.CLIENT_URL || "",
  /\.vercel\.app$/,
].filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.some((allowed) => new RegExp(allowed).test(origin))
    ) {
      callback(null, true);
    } else {
      console.error(`CORS request DENIED from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// PERBAIKAN UTAMA: Hapus awalan /api dari semua rute di sini
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/prompts", promptRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API Prompt Library!" });
});

// Jalankan server hanya saat tidak di Vercel (untuk development lokal)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Ekspor aplikasi untuk Vercel
export default app;
