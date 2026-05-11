import api, { tokenStore } from "./api";

export const signup = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  // Send the refresh token in the body so the backend can invalidate it even
  // when third-party cookies are blocked.
  const refreshToken = tokenStore.getRefresh();
  const response = await api.post(
    "/auth/logout",
    refreshToken ? { refreshToken } : {}
  );
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const requestPasswordReset = async (email, turnstileToken) => {
  const response = await api.post("/auth/forgot-password", {
    email,
    ...(turnstileToken ? { turnstileToken } : {}),
  });
  return response.data;
};

export const submitPasswordReset = async ({ token, password }) => {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
};

export const resendVerificationEmail = async () => {
  const response = await api.post("/auth/verify-email/send");
  return response.data;
};
