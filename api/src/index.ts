// --- TAMBAHKAN KODE DEBUGGING INI DI PALING ATAS ---
console.log("--- API Function Initializing ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI is set:", !!process.env.MONGO_URI);
console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);
if (process.env.MONGO_URI) {
  console.log(
    "MONGO_URI preview:",
    process.env.MONGO_URI.substring(0, 30) + "..."
  );
}
console.log("--- End of Initial Debug Log ---");
// --- BATAS AKHIR KODE DEBUGGING ---

import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import promptRoutes from "./routes/promptRoutes";

// ... sisa kode Anda tetap sama
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

app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/prompts", promptRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API Prompt Library!" });
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

export default app;
