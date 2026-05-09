import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
      default: "cloudinary",
    },

    metadata: {
      width: Number,
      height: Number,
      quality: String,
      aspectRatio: String,
    },
  },
  { timestamps: true }
);

export const Image = mongoose.model("Image", ImageSchema);
