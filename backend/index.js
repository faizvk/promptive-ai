import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { PORT, NODE_ENV, FRONTEND_URL } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./view/auth.router.js";
import imageRouter from "./view/image.routes.js";
import contentRouter from "./view/content.routes.js";
import historyRouter from "./view/history.routes.js";
import dashboardRoutes from "./view/dashboard.router.js";
import googleAuthRoutes from "./view/googleAuth.routes.js";
import paymentsRouter from "./view/payments.routes.js";

const app = express();

// Security headers
app.use(helmet());

// The Razorpay webhook needs the raw body for HMAC verification, so it must
// be mounted BEFORE express.json() with express.raw().
app.post(
  "/payments/webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
  (req, res, next) => paymentsRouter.handle(req, res, next)
);

// Body parsing with explicit size cap
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Request logging
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limit auth endpoints (login + signup) to slow brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again in a few minutes.",
  },
});

// Rate limit AI endpoints to prevent runaway usage
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please slow down and try again shortly.",
  },
});

// Health check (cheap, doesn't touch DB)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Promptive AI backend is running",
  });
});

// Routes
app.use("/auth", authLimiter, authRouter);
app.use("/auth", googleAuthRoutes);
app.use("/images", aiLimiter, imageRouter);
app.use("/content", aiLimiter, contentRouter);
app.use("/history", historyRouter);
app.use("/dashboard", dashboardRoutes);
app.use("/payments", paymentsRouter);

// Centralized error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`)
  );

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully…`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });

    // Force exit after 10s if connections keep socket open
    setTimeout(() => {
      console.warn("Forcing shutdown after timeout.");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
