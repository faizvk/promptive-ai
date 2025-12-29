import ai from "../config/geminiAI.js";
import { Content } from "../model/content.model.js";

export const rewriteContent = async (req, res) => {
  try {
    const { text, tone = "professional" } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Text is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Rewrite the following content in a ${tone} tone.

Rules:
- Preserve the original meaning
- Maintain approximately the same length as the original
- Improve clarity, fluency, and professionalism
- Do NOT summarize or shorten unless explicitly asked

Content:
"""${text}"""
`,
    });

    const rewrittenText = response.text?.trim();

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
          "System is busy (Rate limit reached). Please wait a few seconds and try again.",
      });
    }

    console.error("Content rewrite error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred." });
  }
};
