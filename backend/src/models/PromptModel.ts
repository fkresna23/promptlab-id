import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: { type: String, required: true },
    promptText: { type: String, required: true },
    isPremium: { type: Boolean, required: true, default: false },
    keySentence: { type: String, required: false },
    whatItDoes: { type: [String], required: false },
    tips: { type: [String], required: false },
    howToUse: { type: [String], required: false },
  },
  {
    timestamps: true,
  }
);

const Prompt = mongoose.model("Prompt", promptSchema);
export default Prompt;
