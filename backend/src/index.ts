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

// PERBAIKAN: Logika CORS yang lebih andal
const allowedOrigins = [
  "http://localhost:5173", // Untuk development lokal
  process.env.CLIENT_URL, // URL Produksi utama Anda dari Heroku env
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Izinkan jika origin ada di daftar ATAU jika itu adalah preview URL dari Vercel
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /--fajar-kresnas-projects\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      console.error(`Permintaan CORS DITOLAK dari origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
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
