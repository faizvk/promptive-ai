import api from "./api";

export const fetchPlans = async () => {
  const { data } = await api.get("/payments/plans");
  return data;
};

export const fetchSubscription = async () => {
  const { data } = await api.get("/payments/me");
  return data;
};

export const startSubscription = async (planId) => {
  const { data } = await api.post("/payments/subscribe", { planId });
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await api.post("/payments/verify", payload);
  return data;
};

export const cancelSubscription = async () => {
  const { data } = await api.post("/payments/cancel");
  return data;
};
