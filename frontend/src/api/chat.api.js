import api from "./api";

export const fetchChatModels = async () => {
  const { data } = await api.get("/chat/models");
  return data;
};

export const fetchChats = async () => {
  const { data } = await api.get("/chat");
  return data;
};

export const fetchChat = async (id) => {
  const { data } = await api.get(`/chat/${id}`);
  return data;
};

export const deleteChat = async (id) => {
  const { data } = await api.delete(`/chat/${id}`);
  return data;
};

export const sendChatMessage = async ({ chatId, modelId, message }) => {
  const { data } = await api.post("/chat/messages", {
    chatId,
    modelId,
    message,
  });
  return data;
};
