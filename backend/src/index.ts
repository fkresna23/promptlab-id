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

// PERBAIKAN: Logika CORS yang lebih kuat
const allowedOrigins: (string | undefined)[] = [
  "http://localhost:5173", // Selalu izinkan untuk development
  process.env.CLIENT_URL,
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Izinkan permintaan jika origin ada di dalam daftar, atau jika origin tidak ada (seperti dari Postman/aplikasi server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Permintaan CORS ditolak dari origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
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
