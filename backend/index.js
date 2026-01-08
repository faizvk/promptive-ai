import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./view/auth.router.js";
import imageRouter from "./view/image.routes.js";
import contentRouter from "./view/content.routes.js";
import historyRouter from "./view/history.routes.js";
import dashboardRoutes from "./view/dashboard.router.js";
import googleAuthRoutes from "./view/googleAuth.routes.js";

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Promptive AI backend is running",
  });
});

app.use(authRouter);
app.use("/images", imageRouter);
app.use("/content", contentRouter);
app.use("/history", historyRouter);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", googleAuthRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
