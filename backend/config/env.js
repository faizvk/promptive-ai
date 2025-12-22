import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  MONGO_URI,
  SECRET_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
