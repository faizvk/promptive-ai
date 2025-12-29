import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    rewrittenText: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ["formal", "casual", "professional", "creative"],
      default: "professional",
    },
  },
  { timestamps: true }
);

export const Content = mongoose.model("Content", contentSchema);
