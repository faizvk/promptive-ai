import mongoose from "mongoose";

// One row per user per calendar month. Cheap atomic increments via $inc.
// Resets automatically because each month gets its own document.

const UsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    period: {
      // "YYYY-MM" for the calendar month this row tracks.
      type: String,
      required: true,
    },
    image: { type: Number, default: 0 },
    rewrite: { type: Number, default: 0 },
    chat: { type: Number, default: 0 },
    voice: { type: Number, default: 0 }, // minutes of generated audio
  },
  { timestamps: true }
);

UsageSchema.index({ userId: 1, period: 1 }, { unique: true });

UsageSchema.statics.currentPeriod = function () {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

UsageSchema.statics.fetchOrEmpty = async function (userId) {
  const period = this.currentPeriod();
  const doc = await this.findOne({ userId, period });
  return (
    doc || { period, image: 0, rewrite: 0, chat: 0, voice: 0 }
  );
};

UsageSchema.statics.increment = async function (userId, feature, amount = 1) {
  const period = this.currentPeriod();
  return this.findOneAndUpdate(
    { userId, period },
    { $inc: { [feature]: amount } },
    { upsert: true, new: true }
  );
};

export const Usage = mongoose.model("Usage", UsageSchema);
