import ai from "../config/geminiAI.js";
import { Content } from "../model/content.model.js";

export const rewriteContent = async (req, res) => {
  try {
    const { text, tone = "professional" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        message: "Text to rewrite is required",
      });
    }

    const prompt = `
Rewrite the following content in a ${tone} tone.
Do not change the meaning.
Keep it concise and high quality.

Content:
"""${text}"""
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rewrittenText = response.text?.trim();

    if (!rewrittenText) {
      throw new Error("Empty AI response");
    }

    const record = await Content.create({
      userId: req.user.id,
      originalText: text,
      rewrittenText,
      tone,
    });

    return res.status(200).json({
      success: true,
      content: {
        id: record._id,
        originalText: record.originalText,
        rewrittenText: record.rewrittenText,
        tone: record.tone,
      },
    });
  } catch (error) {
    console.error("Content rewrite error:", error);

    return res.status(500).json({
      success: false,
      message: "Content rewrite failed",
    });
  }
};
