import mongoose from "mongoose";

// Simple key-value store for server-side runtime settings that need to
// outlive a single process (e.g. auto-generated Razorpay plan IDs).
const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", SettingSchema);
