import crypto from "crypto";
import Razorpay from "razorpay";
import {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
} from "../config/env.js";
import { Setting } from "../model/setting.model.js";
import { PLANS } from "../config/plans.js";

export const isRazorpayConfigured = () =>
  Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

let client = null;

export const getRazorpayClient = () => {
  if (!isRazorpayConfigured()) return null;
  if (!client) {
    client = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return client;
};

// Subscription Checkout completion signature: HMAC-SHA256 of
//   `${razorpay_payment_id}|${razorpay_subscription_id}` using KEY_SECRET.
export const verifySubscriptionPaymentSignature = ({
  razorpay_payment_id,
  razorpay_subscription_id,
  razorpay_signature,
}) => {
  if (!RAZORPAY_KEY_SECRET) return false;
  if (
    !razorpay_payment_id ||
    !razorpay_subscription_id ||
    !razorpay_signature
  ) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");
  return expected === razorpay_signature;
};

export const verifyWebhookSignature = (rawBody, signature) => {
  if (!RAZORPAY_WEBHOOK_SECRET || !signature) return false;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  // Constant-time-ish compare
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
};

export const PUBLIC_KEY_ID = RAZORPAY_KEY_ID;

/**
 * Resolve a Razorpay plan_id for one of our internal plan keys.
 *
 * Resolution order:
 *   1. Explicit env override `RAZORPAY_PLAN_ID_<PLAN>` (highest priority)
 *   2. Setting in MongoDB (auto-created plans cached here)
 *   3. Create the plan on Razorpay's side, persist the resulting id, return it
 *
 * This means new deployments don't need manual plan setup in the Razorpay
 * dashboard — the first /subscribe call provisions everything.
 */
export const getOrCreatePlanId = async (planKey) => {
  const plan = PLANS[planKey];
  if (!plan) throw new Error(`Unknown plan: ${planKey}`);
  if (plan.price === 0) {
    throw new Error(`Plan ${planKey} is free — no Razorpay plan needed`);
  }

  // 1) Explicit env override.
  const envKey = `RAZORPAY_PLAN_ID_${planKey.toUpperCase()}`;
  const fromEnv = process.env[envKey];
  if (fromEnv) return fromEnv;

  // 2) Cached in DB.
  const settingKey = `razorpayPlanId.${planKey}`;
  const existing = await Setting.findOne({ key: settingKey });
  if (existing?.value) return existing.value;

  // 3) Create on Razorpay and persist.
  const client = getRazorpayClient();
  if (!client) throw new Error("Razorpay client is not configured");

  const created = await client.plans.create({
    period: "monthly",
    interval: 1,
    item: {
      name: `Promptive AI ${plan.name}`,
      amount: plan.price,
      currency: plan.currency,
      description: plan.description,
    },
  });

  if (!created?.id) {
    throw new Error("Razorpay did not return a plan id");
  }

  // Use upsert so concurrent calls don't insert duplicates.
  const persisted = await Setting.findOneAndUpdate(
    { key: settingKey },
    { $setOnInsert: { value: created.id } },
    { upsert: true, new: true }
  );

  return persisted.value;
};
