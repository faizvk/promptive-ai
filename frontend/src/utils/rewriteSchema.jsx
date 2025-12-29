import { z } from "zod";

export const rewriteSchema = z.object({
  text: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(5000, "Content is too long"),
  tone: z.enum(["professional", "formal", "casual", "creative"]),
});
