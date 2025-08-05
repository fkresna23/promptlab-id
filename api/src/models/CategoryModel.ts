import mongoose from "mongoose";

// Definisikan struktur (Schema) untuk data kategori
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Secara otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Buat Model dari Schema. 'Category' akan menjadi nama collection di database.
const Category = mongoose.model("Category", categorySchema);

export default Category;
