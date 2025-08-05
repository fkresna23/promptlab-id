import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Definisikan tipe untuk dokumen User
export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "user" | "premium" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: any): boolean {
        return !this.googleId;
      },
    },
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ["user", "premium", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Enkripsi password sebelum menyimpan
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Metode untuk membandingkan password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
