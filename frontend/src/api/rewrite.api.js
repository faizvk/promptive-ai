import api from "./api";

export const rewriteContent = async (payload) => {
  const { data } = await api.post("/content/rewrite", payload);
  return data;
};
