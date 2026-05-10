import mongoose from "mongoose";

const EVENT_TYPES = [
  "signup",
  "login_success",
  "login_fail",
  "login_locked",
  "logout",
  "refresh_fail",
  "oauth_success",
  "oauth_fail",
];

const AuthEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: EVENT_TYPES,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    ip: String,
    userAgent: String,
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

AuthEventSchema.index({ createdAt: -1 });

export const AuthEvent = mongoose.model("AuthEvent", AuthEventSchema);
export const AUTH_EVENT_TYPES = EVENT_TYPES;
