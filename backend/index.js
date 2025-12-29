import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./view/auth.router.js";
import imageRouter from "./view/image.routes.js";
import contentRouter from "./view/content.routes.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(authRouter);
app.use("/images", imageRouter);
app.use("/content", contentRouter);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
