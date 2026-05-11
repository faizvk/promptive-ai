import cloudinary from "../config/cloudinary.js";
import { Voice } from "../model/voice.model.js";
import { Usage } from "../model/usage.model.js";
import {
  listVoices,
  isVoiceConfigured,
  synthesizeSpeech,
  estimateSeconds,
} from "../voice/providers.js";

const MAX_INPUT = 2000; // characters per request

export const getVoices = async (req, res) => {
  if (!isVoiceConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Voice synthesis is not configured on this server",
    });
  }
  res.json({ success: true, voices: listVoices() });
};

export const generateVoice = async (req, res) => {
  try {
    if (!isVoiceConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Voice synthesis is not configured on this server",
      });
    }

    const { voiceId } = req.body;
    const text = (req.body.text || "").toString();
    if (!text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Text is required" });
    }
    if (text.length > MAX_INPUT) {
      return res.status(400).json({
        success: false,
        message: `Text must be ${MAX_INPUT} characters or fewer`,
      });
    }
    if (!voiceId) {
      return res
        .status(400)
        .json({ success: false, message: "voiceId is required" });
    }

    const voice = listVoices().find((v) => v.id === voiceId);
    if (!voice) {
      return res
        .status(400)
        .json({ success: false, message: "Unknown voice id" });
    }

    const seconds = estimateSeconds(text);
    const minutes = seconds / 60;

    // Plan limit: voice is tracked in minutes. Re-check the cap including the
    // estimated minutes for this request (the middleware already verified > 0).
    const monthlyLimit = req.plan?.limits?.voice ?? 0;
    const usedMinutes = req.usage?.voice ?? 0;
    if (usedMinutes + minutes > monthlyLimit) {
      return res.status(429).json({
        success: false,
        message: `This request (${minutes.toFixed(1)} min) would exceed your monthly voice quota. Upgrade your plan for more minutes.`,
        plan: req.plan?.id,
        feature: "voice",
        used: usedMinutes,
        limit: monthlyLimit,
      });
    }

    // 1. Synthesize the audio with the chosen provider.
    let buffer;
    let provider;
    try {
      const result = await synthesizeSpeech({ voiceId, text });
      buffer = result.buffer;
      provider = result.provider;
    } catch (err) {
      console.error("TTS provider error:", err);
      const msg = err?.message || "TTS provider error";
      // Surface 401/403/429 from the upstream provider with the right status.
      let status = 502;
      if (/401|403/.test(msg)) status = 502;
      if (/429/.test(msg)) status = 429;
      return res.status(status).json({
        success: false,
        message: `Voice provider failed: ${msg}`,
      });
    }

    // 2. Upload to Cloudinary. We use resource_type:"auto" so Cloudinary
    //    detects the audio mp3 correctly regardless of how the account
    //    is configured (some accounts reject explicit resource_type:"video"
    //    for audio uploads).
    let uploadResult;
    try {
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "promptive-ai/voice",
            resource_type: "auto",
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(502).json({
        success: false,
        message: `Audio upload failed: ${err?.message || "unknown error"}`,
      });
    }

    // 3. Persist + return.
    const record = await Voice.create({
      userId: req.user.id,
      text,
      voiceId,
      voiceName: voice.name,
      provider,
      audioUrl: uploadResult.secure_url,
      durationSec: seconds,
    });

    Usage.increment(req.user.id, "voice", minutes).catch((e) =>
      console.error("usage:voice increment failed", e.message)
    );

    res.status(201).json({
      success: true,
      voice: {
        id: record._id,
        text: record.text,
        voiceId: record.voiceId,
        voiceName: record.voiceName,
        provider: record.provider,
        audioUrl: record.audioUrl,
        durationSec: record.durationSec,
      },
    });
  } catch (err) {
    console.error("Voice generation error:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Voice generation failed",
    });
  }
};
