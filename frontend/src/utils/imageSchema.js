import { z } from "zod";

export const imageSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(1000, "Prompt is too long"),
  resolution: z.enum(["512x512", "768x768", "1024x1024"]),
  aspectRatio: z.enum(["1:1", "16:9", "9:16"]),
  quality: z.enum(["fast", "balanced", "ultra"]),
  negativePrompt: z
    .string()
    .max(500, "Negative prompt is too long")
    .optional()
    .or(z.literal("")),
});
