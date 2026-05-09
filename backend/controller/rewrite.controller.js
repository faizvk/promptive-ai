import ai from "../config/geminiAI.js";
import { Content } from "../model/content.model.js";

const ALLOWED_TONES = ["professional", "formal", "casual", "creative"];

export const rewriteContent = async (req, res) => {
  try {
    const { text, tone = "professional" } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Text is required" });
    }

    if (!ALLOWED_TONES.includes(tone)) {
      return res.status(400).json({
        success: false,
        message: `Tone must be one of: ${ALLOWED_TONES.join(", ")}`,
      });
    }

    const prompt = [
      `Rewrite the following content in a ${tone} tone.`,
      `Preserve the original meaning, structure, and length.`,
      `Do NOT summarize or shorten unless explicitly asked.`,
      `Return only the rewritten text — no preamble, no explanation.`,
      "",
      "Content:",
      `"""${text}"""`,
    ].join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rewrittenText = response.text?.trim();

    if (!rewrittenText) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response. Please try again.",
      });
    }

    const record = await Content.create({
      userId: req.user.id,
      originalText: text,
      rewrittenText,
      tone,
    });

    return res.status(200).json({ success: true, content: record });
  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "System is busy (rate limit reached). Please wait a few seconds and try again.",
      });
    }

    console.error("Content rewrite error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
  }
};
