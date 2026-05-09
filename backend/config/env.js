import dotenv from "dotenv";

dotenv.config();

const required = [
  "MONGO_URI",
  "SECRET_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GEMINI_API_KEY",
  "HUGGINGFACE_API_KEY",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    `❌ Missing required environment variables: ${missing.join(", ")}`
  );
  console.error(
    "Refer to backend/.env.example for the full list and copy it to .env"
  );
  process.exit(1);
}

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const MONGO_URI = process.env.MONGO_URI;
export const SECRET_KEY = process.env.SECRET_KEY;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
