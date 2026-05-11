import {
  ELEVENLABS_API_KEY,
  OPENAI_API_KEY,
} from "../config/env.js";

// Static voice catalogue per provider.
const ELEVENLABS_VOICES = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Calm, neutral American female",
    provider: "elevenlabs",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    description: "Confident American female",
    provider: "elevenlabs",
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    description: "Warm American female",
    provider: "elevenlabs",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    description: "Deep American male",
    provider: "elevenlabs",
  },
  {
    id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    description: "Crisp American male",
    provider: "elevenlabs",
  },
];

const OPENAI_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map(
  (name) => ({
    id: name,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    description: "OpenAI TTS voice",
    provider: "openai",
  })
);

export const isVoiceConfigured = () =>
  Boolean(ELEVENLABS_API_KEY || OPENAI_API_KEY);

// Order matters here: the frontend auto-selects voices[0]. OpenAI is more
// reliable for cloud-deployed accounts since ElevenLabs free tier flags
// datacenter IPs as "unusual activity" and disables the key.
export const listVoices = () => {
  const all = [];
  if (OPENAI_API_KEY) all.push(...OPENAI_VOICES);
  if (ELEVENLABS_API_KEY) all.push(...ELEVENLABS_VOICES);
  return all;
};

const findVoice = (id) => listVoices().find((v) => v.id === id);

const elevenlabsTTS = async ({ voiceId, text }) => {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err.slice(0, 300)}`);
  }
  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
};

const openaiTTS = async ({ voiceId, text }) => {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: voiceId,
      input: text,
      response_format: "mp3",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI TTS ${res.status}: ${err.slice(0, 300)}`);
  }
  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
};

export const synthesizeSpeech = async ({ voiceId, text }) => {
  const voice = findVoice(voiceId);
  if (!voice) throw new Error(`Unknown voice id: ${voiceId}`);

  if (voice.provider === "elevenlabs") {
    return {
      buffer: await elevenlabsTTS({ voiceId, text }),
      provider: "elevenlabs",
    };
  }
  if (voice.provider === "openai") {
    return {
      buffer: await openaiTTS({ voiceId, text }),
      provider: "openai",
    };
  }
  throw new Error(`No handler for provider ${voice.provider}`);
};

// Approximate duration in seconds. We don't probe the mp3 — assume an
// average of 150 words per minute (≈150 wpm * 5 chars/word ≈ 750 chars/min).
export const estimateSeconds = (text) =>
  Math.max(1, Math.round(text.length / (750 / 60)));
