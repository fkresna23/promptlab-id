import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d", // Token akan kedaluwarsa dalam 30 hari
  });
};

export default generateToken;
