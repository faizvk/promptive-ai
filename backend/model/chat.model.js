import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: { type: String, required: true },
    model: { type: String }, // assistant messages only
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "New chat" },
    model: { type: String }, // model used for the most recent turn
    messages: [MessageSchema],
  },
  { timestamps: true }
);

ChatSchema.index({ userId: 1, updatedAt: -1 });

export const Chat = mongoose.model("Chat", ChatSchema);
