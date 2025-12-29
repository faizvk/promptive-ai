import api from "./api";

export const generateImage = async (data) => {
  const response = await api.post("/images/generate-image", data);
  return response.data;
};
