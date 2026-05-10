import {
  OPENAI_API_KEY,
  ANTHROPIC_API_KEY,
  GROQ_API_KEY,
  GEMINI_API_KEY,
} from "../config/env.js";
import gemini from "../config/geminiAI.js";

// Static model catalogue. Each entry declares which provider serves it and
// the lowest plan tier that can use it (free|pro|business).
//
// New 2026 models can be added here without touching the controller.
const MODELS = {
  "gemini-2.5-flash": {
    provider: "gemini",
    tier: "free",
    displayName: "Gemini 2.5 Flash",
    description: "Fast, balanced model from Google.",
  },
  "gpt-4o-mini": {
    provider: "openai",
    tier: "free",
    displayName: "GPT-4o mini",
    description: "Affordable OpenAI model for everyday chat.",
  },
  "gpt-4o": {
    provider: "openai",
    tier: "pro",
    displayName: "GPT-4o",
    description: "OpenAI's flagship multi-modal model.",
  },
  "claude-3-5-haiku-latest": {
    provider: "anthropic",
    tier: "free",
    displayName: "Claude 3.5 Haiku",
    description: "Anthropic's fast, lightweight model.",
  },
  "claude-3-5-sonnet-latest": {
    provider: "anthropic",
    tier: "pro",
    displayName: "Claude 3.5 Sonnet",
    description: "High-quality reasoning from Anthropic.",
  },
  "llama-3.3-70b-versatile": {
    provider: "groq",
    tier: "free",
    displayName: "Llama 3.3 70B (Groq)",
    description: "Open Meta model served at very low latency.",
  },
};

const PROVIDER_KEY = {
  gemini: GEMINI_API_KEY,
  openai: OPENAI_API_KEY,
  anthropic: ANTHROPIC_API_KEY,
  groq: GROQ_API_KEY,
};

export const isProviderConfigured = (provider) =>
  Boolean(PROVIDER_KEY[provider]);

export const listAvailableModels = () =>
  Object.entries(MODELS)
    .filter(([, m]) => isProviderConfigured(m.provider))
    .map(([id, m]) => ({
      id,
      displayName: m.displayName,
      description: m.description,
      provider: m.provider,
      tier: m.tier,
    }));

export const getModel = (id) => MODELS[id];

const TIER_RANK = { free: 0, pro: 1, business: 2 };
export const isModelAvailableForPlan = (modelId, planId) => {
  const m = MODELS[modelId];
  if (!m) return false;
  return TIER_RANK[planId] >= TIER_RANK[m.tier];
};

/* =========================
   Provider implementations
   ========================= */

const splitSystem = (messages) => {
  const sys = messages.filter((m) => m.role === "system");
  const rest = messages.filter((m) => m.role !== "system");
  const systemText = sys.map((m) => m.content).join("\n").trim();
  return { systemText, messages: rest };
};

const callOpenAI = async ({ modelId, messages }) => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  return {
    text: data.choices?.[0]?.message?.content?.trim() || "",
    usage: data.usage || null,
  };
};

const callGroq = async ({ modelId, messages }) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  return {
    text: data.choices?.[0]?.message?.content?.trim() || "",
    usage: data.usage || null,
  };
};

const callAnthropic = async ({ modelId, messages }) => {
  const { systemText, messages: chat } = splitSystem(messages);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      ...(systemText ? { system: systemText } : {}),
      messages: chat.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
  return { text, usage: data.usage || null };
};

const callGemini = async ({ modelId, messages }) => {
  // Gemini wants an array of {role, parts:[{text}]} entries with role
  // in {"user","model"}. We translate our chat.
  const { systemText, messages: chat } = splitSystem(messages);
  const contents = chat.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await gemini.models.generateContent({
    model: modelId,
    contents,
    ...(systemText
      ? { systemInstruction: { parts: [{ text: systemText }] } }
      : {}),
  });

  const text =
    typeof response.text === "function"
      ? response.text()
      : response.text || "";
  return { text: String(text).trim(), usage: null };
};

const PROVIDER_HANDLERS = {
  openai: callOpenAI,
  groq: callGroq,
  anthropic: callAnthropic,
  gemini: callGemini,
};

export const callModel = async ({ modelId, messages }) => {
  const m = MODELS[modelId];
  if (!m) throw new Error(`Unknown model: ${modelId}`);
  if (!isProviderConfigured(m.provider)) {
    throw new Error(
      `Provider ${m.provider} is not configured on this server.`
    );
  }
  const handler = PROVIDER_HANDLERS[m.provider];
  if (!handler) throw new Error(`No handler for provider ${m.provider}`);
  return handler({ modelId, messages });
};

export const TIER_RANKS = TIER_RANK;
