import { Image } from "../model/image.model.js";
import { Content } from "../model/content.model.js";

const formatLastActivity = (date) => {
  if (!date) return "—";
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.round(diffMs / (60 * 1000));

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.round(diffDay / 30);
  return `${diffMonth}mo ago`;
};

export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [imageCount, rewriteCount, latestImage, latestRewrite] =
      await Promise.all([
        Image.countDocuments({ userId }),
        Content.countDocuments({ userId }),
        Image.findOne({ userId }).sort({ createdAt: -1 }).select("createdAt"),
        Content.findOne({ userId }).sort({ createdAt: -1 }).select("createdAt"),
      ]);

    const latestDates = [latestImage?.createdAt, latestRewrite?.createdAt]
      .filter(Boolean)
      .map((d) => new Date(d).getTime());
    const lastActivityAt = latestDates.length ? Math.max(...latestDates) : null;

    return res.status(200).json({
      success: true,
      stats: {
        imagesGenerated: imageCount,
        rewritesDone: rewriteCount,
        totalActions: imageCount + rewriteCount,
        lastActivity: formatLastActivity(lastActivityAt),
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
