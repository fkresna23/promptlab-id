import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import Category from "./models/CategoryModel";
import User from "./models/UserModel";
import Prompt from "./models/PromptModel";
import { promptsData } from "./data/prompts";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const importData = async () => {
  try {
    await connectDB();
    console.log(
      `Seeder terhubung ke MongoDB: ${mongoose.connection.db?.databaseName}`
    );

    await Prompt.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
      },
    ]);
    const adminUser = createdUsers[0]._id;

    const categoriesSample = [
      { icon: "SalesIcon", title: "Sales", count: 252, isNew: true },
      { icon: "EducationIcon", title: "Education", count: 276, isNew: true },
      { icon: "SolopreneursIcon", title: "Solopreneurs", count: 201 },
      { icon: "SeoIcon", title: "SEO", count: 223 },
      { icon: "ProductivityIcon", title: "Productivity", count: 218 },
      { icon: "WritingIcon", title: "Writing", count: 383 },
      { icon: "BusinessIcon", title: "Business", count: 293 },
      { icon: "MarketingIcon", title: "Marketing", count: 177 },
    ];
    const createdCategories = await Category.insertMany(categoriesSample);

    const salesCategory = createdCategories.find(
      (c) => c.title === "Sales"
    )?._id;
    const educationCategory = createdCategories.find(
      (c) => c.title === "Education"
    )?._id;

    if (salesCategory) {
      const samplePrompts = promptsData.slice(0, 3).map((prompt) => ({
        ...prompt,
        user: adminUser,
        category: salesCategory,
      }));
      await Prompt.insertMany(samplePrompts);
    }

    if (educationCategory) {
      const samplePrompts = promptsData.slice(3, 6).map((prompt) => ({
        ...prompt,
        user: adminUser,
        category: educationCategory,
      }));
      await Prompt.insertMany(samplePrompts);
    }

    console.log("Data berhasil diimpor!");
    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
