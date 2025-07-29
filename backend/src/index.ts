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

// PERBAIKAN: Konfigurasi CORS yang lebih type-safe
const allowedOrigins: (string | RegExp)[] = [
  "http://localhost:5173", // Untuk development lokal
  process.env.CLIENT_URL || "", // URL Produksi utama Anda dari Heroku env
  /\.vercel\.app$/, // Untuk semua subdomain Vercel
].filter(Boolean); // Hapus string kosong jika CLIENT_URL undefined

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Izinkan jika tidak ada origin (mobile apps, Postman, etc.) atau jika origin diizinkan
    if (!origin) {
      callback(null, true);
      return;
    }

    // Cek apakah origin diizinkan
    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === "string") {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`Permintaan CORS DITOLAK dari origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Izinkan cookies jika diperlukan
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
