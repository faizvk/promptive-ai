import cloudinary from "../config/cloudinary.js";
import hf from "../config/huggingface.js";
import { Image } from "../model/image.model.js";

const QUALITY_PRESETS = {
  fast: {
    steps: 12,
    guidance: 6.5,
  },
  balanced: {
    steps: 25,
    guidance: 7.5,
  },
  ultra: {
    steps: 40,
    guidance: 8,
  },
};

const ASPECT_RATIOS = {
  "1:1": (size) => [size, size],
  "16:9": (size) => [size, Math.round((size * 9) / 16)],
  "9:16": (size) => [Math.round((size * 9) / 16), size],
};

export const generateImage = async (req, res) => {
  try {
    const {
      prompt,
      resolution = "768x768",
      aspectRatio = "1:1",
      quality = "balanced",
      negativePrompt,
      seed,
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Base resolution (square reference)
    const baseSize = Number(resolution.split("x")[0]) || 768;

    // Compute width & height from aspect ratio
    const ratioFn = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS["1:1"];
    const [width, height] = ratioFn(baseSize);

    // Quality preset
    const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.balanced;

    // Hugging Face inference
    const imageBlob = await hf.textToImage({
      provider: "hf-inference",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
      parameters: {
        width,
        height,
        num_inference_steps: preset.steps,
        guidance_scale: preset.guidance,
        negative_prompt:
          negativePrompt ||
          "blurry, low quality, distorted, watermark, text, logo",
        ...(seed ? { seed: Number(seed) } : {}),
      },
    });

    // Convert Blob → Buffer
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // Upload to Cloudinary (stream = memory safe)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "promptive-ai/images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    // Persist to DB
    const imageRecord = await Image.create({
      userId: req.user.id,
      prompt,
      imageUrl: uploadResult.secure_url,
      metadata: {
        width,
        height,
        quality,
        aspectRatio,
      },
    });

    return res.status(201).json({
      success: true,
      image: {
        id: imageRecord._id,
        prompt: imageRecord.prompt,
        imageUrl: imageRecord.imageUrl,
        width,
        height,
        quality,
        aspectRatio,
      },
    });
  } catch (error) {
    console.error("Image generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Image generation failed",
    });
  }
};
