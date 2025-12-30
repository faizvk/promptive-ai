import api from "./api";

export const fetchHistory = async ({ type, page = 1 }) => {
  const { data } = await api.get("/history", {
    params: { type, page },
  });
  return data;
};

export const deleteHistoryItem = async ({ type, id }) => {
  const { data } = await api.delete(`/history/${type}/${id}`);
  return data;
};
