import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // PERBAIKAN DI SINI
    console.log(
      `MongoDB Terhubung: ${conn.connection.host} ke database ${conn.connection.db?.databaseName}`
    );
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
