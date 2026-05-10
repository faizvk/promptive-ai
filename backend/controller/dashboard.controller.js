import { Image } from "../model/image.model.js";
import { Content } from "../model/content.model.js";
import { Chat } from "../model/chat.model.js";
import { Voice } from "../model/voice.model.js";
import { Usage } from "../model/usage.model.js";
import { User } from "../model/user.model.js";
import { getPlan } from "../config/plans.js";

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

    const [
      imageCount,
      rewriteCount,
      chatCount,
      voiceCount,
      latestImage,
      latestRewrite,
      latestChat,
      latestVoice,
      usage,
      user,
    ] = await Promise.all([
      Image.countDocuments({ userId }),
      Content.countDocuments({ userId }),
      Chat.countDocuments({ userId }),
      Voice.countDocuments({ userId }),
      Image.findOne({ userId }).sort({ createdAt: -1 }).select("createdAt"),
      Content.findOne({ userId }).sort({ createdAt: -1 }).select("createdAt"),
      Chat.findOne({ userId }).sort({ updatedAt: -1 }).select("updatedAt"),
      Voice.findOne({ userId }).sort({ createdAt: -1 }).select("createdAt"),
      Usage.fetchOrEmpty(userId),
      User.findById(userId).select("subscription"),
    ]);

    const latestDates = [
      latestImage?.createdAt,
      latestRewrite?.createdAt,
      latestChat?.updatedAt,
      latestVoice?.createdAt,
    ]
      .filter(Boolean)
      .map((d) => new Date(d).getTime());
    const lastActivityAt = latestDates.length ? Math.max(...latestDates) : null;

    const planId = user?.subscription?.plan || "free";
    const plan = getPlan(planId);

    return res.status(200).json({
      success: true,
      stats: {
        imagesGenerated: imageCount,
        rewritesDone: rewriteCount,
        chatsStarted: chatCount,
        voicesGenerated: voiceCount,
        totalActions: imageCount + rewriteCount + chatCount + voiceCount,
        lastActivity: formatLastActivity(lastActivityAt),
      },
      plan: {
        id: plan.id,
        name: plan.name,
        limits: plan.limits,
      },
      usage: {
        period: usage.period,
        image: usage.image || 0,
        rewrite: usage.rewrite || 0,
        chat: usage.chat || 0,
        voice: usage.voice || 0,
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
