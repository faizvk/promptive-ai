import { Chat } from "../model/chat.model.js";
import { Usage } from "../model/usage.model.js";
import {
  callModel,
  getModel,
  isModelAvailableForPlan,
  listAvailableModels,
} from "../chat/providers.js";

const MAX_HISTORY_MESSAGES = 30; // last N turns sent to the model
const MAX_USER_INPUT = 8000; // characters

const titleFromPrompt = (text) => {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > 60 ? t.slice(0, 57) + "…" : t || "New chat";
};

export const listModels = async (req, res) => {
  const planId = req.plan?.id || "free";
  const models = listAvailableModels().map((m) => ({
    ...m,
    available: isModelAvailableForPlan(m.id, planId),
  }));
  res.json({
    success: true,
    plan: planId,
    models,
  });
};

export const listChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(50)
      .select("title model updatedAt messages");

    // Summarise messages: just last role + preview to avoid shipping the
    // whole conversation in the list view.
    const summary = chats.map((c) => ({
      id: c._id,
      title: c.title,
      model: c.model,
      updatedAt: c.updatedAt,
      lastMessagePreview:
        c.messages.length > 0
          ? c.messages[c.messages.length - 1].content.slice(0, 100)
          : "",
    }));

    res.json({ success: true, chats: summary });
  } catch (err) {
    console.error("listChats error:", err);
    res.status(500).json({ success: false, message: "Failed to load chats" });
  }
};

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, chat });
  } catch {
    res.status(400).json({ success: false, message: "Invalid id" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const result = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!result) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true });
  } catch {
    res.status(400).json({ success: false, message: "Invalid id" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, modelId } = req.body;
    const message = (req.body.message || "").toString().slice(0, MAX_USER_INPUT);

    if (!message.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    if (!modelId || !getModel(modelId)) {
      return res
        .status(400)
        .json({ success: false, message: "Unknown model" });
    }

    const planId = req.plan?.id || "free";
    if (!isModelAvailableForPlan(modelId, planId)) {
      return res.status(403).json({
        success: false,
        message: "This model requires a higher plan tier.",
        plan: planId,
      });
    }

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      if (!chat) {
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });
      }
    } else {
      chat = await Chat.create({
        userId: req.user.id,
        title: titleFromPrompt(message),
        model: modelId,
        messages: [],
      });
    }

    chat.messages.push({ role: "user", content: message });

    // Send only the most recent N messages to the model to keep the prompt
    // window manageable.
    const window = chat.messages.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let assistantText = "";
    try {
      const result = await callModel({ modelId, messages: window });
      assistantText = result.text || "";
    } catch (err) {
      console.error("Model call failed:", err.message);
      // Drop the just-pushed user message? No — keep it so the user can retry.
      await chat.save();
      return res.status(502).json({
        success: false,
        message: "AI provider error. Please try again or pick a different model.",
        chatId: chat._id,
      });
    }

    chat.messages.push({
      role: "assistant",
      content: assistantText,
      model: modelId,
    });
    chat.model = modelId;
    if (!chat.title || chat.title === "New chat") {
      chat.title = titleFromPrompt(message);
    }
    await chat.save();

    Usage.increment(req.user.id, "chat", 1).catch((e) =>
      console.error("usage:chat increment failed", e.message)
    );

    res.json({
      success: true,
      chat: {
        id: chat._id,
        title: chat.title,
        model: chat.model,
        messages: chat.messages,
      },
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
