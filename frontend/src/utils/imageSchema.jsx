import { z } from "zod";

export const imageSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(1000, "Prompt is too long"),
  resolution: z.enum(["512x512", "768x768", "1024x1024"]),
});
