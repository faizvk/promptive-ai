import { Image } from "../model/image.model.js";
import { Content } from "../model/content.model.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [imageCount, rewriteCount] = await Promise.all([
      Image.countDocuments({ userId }),
      Content.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        imagesGenerated: imageCount,
        rewritesDone: rewriteCount,
        totalActions: imageCount + rewriteCount,
        aiStatus: "Fast",
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard overview",
    });
  }
};
