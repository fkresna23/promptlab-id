import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB Connected: ${conn.connection.host} to database ${conn.connection.db?.databaseName}`
    );
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Lemparkan error agar Vercel mencatatnya sebagai kegagalan inisialisasi fungsi,
    // alih-alih mematikan proses secara paksa.
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

export default connectDB;
