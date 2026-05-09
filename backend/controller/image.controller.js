import cloudinary from "../config/cloudinary.js";
import hf from "../config/huggingface.js";
import { Image } from "../model/image.model.js";

const QUALITY_PRESETS = {
  fast: { steps: 12, guidance: 6.5 },
  balanced: { steps: 25, guidance: 7.5 },
  ultra: { steps: 40, guidance: 8 },
};

const ASPECT_RATIOS = {
  "1:1": (size) => [size, size],
  "16:9": (size) => [size, Math.round((size * 9) / 16)],
  "9:16": (size) => [Math.round((size * 9) / 16), size],
};

const VALID_RESOLUTIONS = ["512x512", "768x768", "1024x1024"];
const MAX_PROMPT_LENGTH = 1000;

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

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer`,
      });
    }

    if (!VALID_RESOLUTIONS.includes(resolution)) {
      return res.status(400).json({
        success: false,
        message: `Invalid resolution. Use one of: ${VALID_RESOLUTIONS.join(", ")}`,
      });
    }

    if (!ASPECT_RATIOS[aspectRatio]) {
      return res.status(400).json({
        success: false,
        message: `Invalid aspect ratio. Use one of: ${Object.keys(ASPECT_RATIOS).join(", ")}`,
      });
    }

    if (!QUALITY_PRESETS[quality]) {
      return res.status(400).json({
        success: false,
        message: `Invalid quality. Use one of: ${Object.keys(QUALITY_PRESETS).join(", ")}`,
      });
    }

    const baseSize = Number(resolution.split("x")[0]) || 768;
    const [width, height] = ASPECT_RATIOS[aspectRatio](baseSize);
    const preset = QUALITY_PRESETS[quality];

    const imageBlob = await hf.textToImage({
      provider: "hf-inference",
      model: "black-forest-labs/FLUX.1-schnell",
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

    const buffer = Buffer.from(await imageBlob.arrayBuffer());

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

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI provider is rate-limited. Please wait a moment and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Image generation failed",
    });
  }
};
