import { User } from "../model/user.model.js";
import { Usage } from "../model/usage.model.js";
import { getPlan } from "../config/plans.js";

const isSubscriptionActive = (sub) => {
  if (!sub) return false;
  if (sub.plan === "free") return true; // free is always "active"
  if (sub.status !== "active") return false;
  if (sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() < Date.now()) {
    return false;
  }
  return true;
};

export const enforcePlanLimit = (feature) => async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select("subscription");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const planId = isSubscriptionActive(user.subscription)
      ? user.subscription?.plan || "free"
      : "free";

    const plan = getPlan(planId);
    const monthlyLimit = plan.limits[feature];

    // 0 means feature not allowed on this plan.
    if (monthlyLimit === 0) {
      return res.status(403).json({
        success: false,
        message: `${feature} is not included in your plan. Upgrade to use it.`,
        plan: planId,
        feature,
      });
    }

    const usage = await Usage.fetchOrEmpty(user._id);
    const used = usage[feature] || 0;

    if (used >= monthlyLimit) {
      return res.status(429).json({
        success: false,
        message: `You've reached your monthly ${feature} limit (${monthlyLimit}). Upgrade your plan to keep going.`,
        plan: planId,
        feature,
        used,
        limit: monthlyLimit,
      });
    }

    // Stash plan info on the request so controllers can reference it
    // (e.g. to gate premium models).
    req.plan = plan;
    req.usage = usage;
    next();
  } catch (err) {
    console.error("Plan limit middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to check plan limits",
    });
  }
};

export const recordUsage = (feature, amount = 1) => async (userId) => {
  try {
    await Usage.increment(userId, feature, amount);
  } catch (err) {
    console.error(`Failed to record ${feature} usage:`, err.message);
  }
};
