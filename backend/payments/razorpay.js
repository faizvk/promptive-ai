import crypto from "crypto";
import Razorpay from "razorpay";
import {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
} from "../config/env.js";

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
