// Plan catalogue. Prices are in the smallest currency unit (paise for INR)
// because Razorpay APIs work in paise.

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    description: "Get started with the basics, no card required.",
    limits: {
      image: 5,
      rewrite: 20,
      chat: 50,
      voice: 0,
    },
    features: [
      "5 AI images / month",
      "20 content rewrites / month",
      "50 chat messages / month",
      "Email support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 49900, // ₹499
    currency: "INR",
    description: "For serious creators and small teams.",
    limits: {
      image: 100,
      rewrite: 500,
      chat: 1000,
      voice: 30, // minutes of generated audio
    },
    features: [
      "100 AI images / month",
      "500 content rewrites / month",
      "1,000 chat messages / month",
      "30 minutes of voice synthesis / month",
      "Access to premium AI models",
      "Priority support",
    ],
    razorpayPlanIdEnv: "RAZORPAY_PLAN_ID_PRO",
  },
  business: {
    id: "business",
    name: "Business",
    price: 149900, // ₹1499
    currency: "INR",
    description: "For agencies and high-volume usage.",
    limits: {
      image: 1000,
      rewrite: 5000,
      chat: 10000,
      voice: 300,
    },
    features: [
      "1,000 AI images / month",
      "5,000 content rewrites / month",
      "10,000 chat messages / month",
      "5 hours of voice synthesis / month",
      "All premium AI models",
      "Workspace collaboration (coming soon)",
      "Priority support + dedicated SLA",
    ],
    razorpayPlanIdEnv: "RAZORPAY_PLAN_ID_BUSINESS",
  },
};

export const PLAN_ORDER = ["free", "pro", "business"];

export const getPlan = (id) => PLANS[id] || PLANS.free;

export const FEATURE_KEYS = ["image", "rewrite", "chat", "voice"];
