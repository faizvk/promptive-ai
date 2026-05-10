import api from "./api";

export const fetchVoices = async () => {
  const { data } = await api.get("/voice/voices");
  return data;
};

export const generateVoice = async ({ text, voiceId }) => {
  const { data } = await api.post("/voice/generate", { text, voiceId });
  return data;
};
