import express from "express";
import { User } from "../model/user.model.js";
import { verifyToken } from "../auth/auth.middleware.js";
import { logAuthEvent } from "../auth/auditLog.js";
import { PLANS, PLAN_ORDER, getPlan } from "../config/plans.js";
import {
  getRazorpayClient,
  isRazorpayConfigured,
  verifySubscriptionPaymentSignature,
  verifyWebhookSignature,
  PUBLIC_KEY_ID,
  getOrCreatePlanId,
} from "../payments/razorpay.js";

const router = express.Router();

const requireRazorpay = (req, res, next) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Payments are not configured on this server",
    });
  }
  next();
};

/* =========================
   Plans (public)
   ========================= */
router.get("/plans", (req, res) => {
  const plans = PLAN_ORDER.map((id) => {
    const plan = PLANS[id];
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      description: plan.description,
      features: plan.features,
      limits: plan.limits,
      paid: plan.price > 0,
    };
  });
  res.json({
    success: true,
    plans,
    paymentsConfigured: isRazorpayConfigured(),
    razorpayKeyId: PUBLIC_KEY_ID || null,
  });
});

/* =========================
   Current subscription summary (auth required)
   ========================= */
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("subscription");
  if (!user) return res.status(404).json({ success: false });

  res.json({
    success: true,
    subscription: user.subscription || { plan: "free", status: "none" },
    plan: getPlan(user.subscription?.plan || "free"),
  });
});

/* =========================
   Create a subscription (auth required)
   Body: { planId: "pro" | "business" }
   ========================= */
router.post("/subscribe", verifyToken, requireRazorpay, async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId || !PLANS[planId]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan id" });
    }
    const plan = PLANS[planId];
    if (plan.price === 0) {
      return res.status(400).json({
        success: false,
        message: "Free plan does not require subscription",
      });
    }

    let razorpayPlanId;
    try {
      razorpayPlanId = await getOrCreatePlanId(plan.id);
    } catch (err) {
      console.error("Failed to resolve Razorpay plan id:", err);
      return res.status(503).json({
        success: false,
        message:
          err?.error?.description ||
          err.message ||
          "Failed to set up subscription plan",
      });
    }

    const client = getRazorpayClient();
    const subscription = await client.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: 12, // 1 year of monthly billing; adjust to taste
      customer_notify: 1,
      notes: {
        userId: String(req.user.id),
        planId: plan.id,
      },
    });

    // Persist that the user is mid-checkout — final activation comes via webhook.
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          "subscription.plan": plan.id,
          "subscription.status": "past_due", // not yet active
          "subscription.razorpaySubscriptionId": subscription.id,
        },
      }
    );

    res.json({
      success: true,
      subscriptionId: subscription.id,
      razorpayKeyId: PUBLIC_KEY_ID,
      planId: plan.id,
      shortUrl: subscription.short_url,
    });
  } catch (err) {
    console.error("Razorpay subscribe error:", err);
    res.status(500).json({
      success: false,
      message: err?.error?.description || "Failed to create subscription",
    });
  }
});

/* =========================
   Verify Checkout result (auth required)
   Body: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }
   ========================= */
router.post("/verify", verifyToken, requireRazorpay, async (req, res) => {
  try {
    const ok = verifySubscriptionPaymentSignature(req.body);
    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const { razorpay_subscription_id } = req.body;
    const client = getRazorpayClient();
    const subscription = await client.subscriptions.fetch(
      razorpay_subscription_id
    );

    if (
      subscription.notes?.userId &&
      subscription.notes.userId !== String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Subscription does not belong to this user",
      });
    }

    // Map Razorpay status → ours.
    const statusMap = {
      active: "active",
      authenticated: "active",
      pending: "past_due",
      halted: "halted",
      cancelled: "cancelled",
      completed: "cancelled",
      expired: "cancelled",
    };
    const status = statusMap[subscription.status] || "past_due";

    const periodEnd = subscription.current_end
      ? new Date(subscription.current_end * 1000)
      : null;

    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          "subscription.status": status,
          "subscription.currentPeriodEnd": periodEnd,
          "subscription.cancelAtPeriodEnd": false,
        },
      }
    );

    logAuthEvent(req, "signup", {
      userId: req.user.id,
      meta: { event: "subscription_verified", plan: subscription.notes?.planId },
    });

    res.json({ success: true, status });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});

/* =========================
   Cancel at period end (auth required)
   ========================= */
router.post("/cancel", verifyToken, requireRazorpay, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.subscription?.razorpaySubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "No active subscription to cancel",
      });
    }

    const client = getRazorpayClient();
    await client.subscriptions.cancel(
      user.subscription.razorpaySubscriptionId,
      true // cancel_at_cycle_end
    );

    user.subscription.cancelAtPeriodEnd = true;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Razorpay cancel error:", err);
    res.status(500).json({
      success: false,
      message: err?.error?.description || "Failed to cancel subscription",
    });
  }
});

/* =========================
   Webhook (no auth, signature-verified, raw body)
   Mounted with express.raw before the global json parser in index.js.
   ========================= */
router.post("/webhook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body; // Buffer because of express.raw

  if (!Buffer.isBuffer(rawBody)) {
    return res.status(400).send("invalid body");
  }

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn("Razorpay webhook: bad signature");
    return res.status(400).send("invalid signature");
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).send("bad json");
  }

  const event = payload.event;
  const subscription = payload.payload?.subscription?.entity;
  const subscriptionId = subscription?.id;

  if (!subscriptionId) {
    return res.status(200).send("ignored");
  }

  try {
    const user = await User.findOne({
      "subscription.razorpaySubscriptionId": subscriptionId,
    });

    if (!user) {
      return res.status(200).send("user not found, ignored");
    }

    // Map events to status
    if (
      event === "subscription.activated" ||
      event === "subscription.charged"
    ) {
      user.subscription.status = "active";
      if (subscription.current_end) {
        user.subscription.currentPeriodEnd = new Date(
          subscription.current_end * 1000
        );
      }
      user.subscription.plan = subscription.notes?.planId || user.subscription.plan;
    } else if (event === "subscription.halted") {
      user.subscription.status = "halted";
    } else if (
      event === "subscription.cancelled" ||
      event === "subscription.completed" ||
      event === "subscription.expired"
    ) {
      user.subscription.status = "cancelled";
      user.subscription.plan = "free";
    } else if (event === "subscription.pending") {
      user.subscription.status = "past_due";
    }

    await user.save();
    res.status(200).send("ok");
  } catch (err) {
    console.error("Razorpay webhook handler error:", err);
    res.status(500).send("error");
  }
});

export default router;
