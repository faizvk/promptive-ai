import mongoose from "mongoose";

const VoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, required: true },
    voiceId: { type: String, required: true },
    voiceName: { type: String },
    provider: { type: String, enum: ["elevenlabs", "openai"], required: true },
    audioUrl: { type: String, required: true },
    durationSec: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VoiceSchema.index({ userId: 1, createdAt: -1 });

export const Voice = mongoose.model("Voice", VoiceSchema);
