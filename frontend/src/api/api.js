import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL && import.meta.env.MODE !== "test") {
  console.warn(
    "VITE_API_BASE_URL is not set. API requests will fail. " +
      "Copy frontend/.env.example to .env.local and set it."
  );
}

const ACCESS_KEY = "promptive.accessToken";
const REFRESH_KEY = "promptive.refreshToken";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  // Cookies still flow when the browser allows them (helps same-eTLD+1 setups).
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Always attach the access token as a Bearer header if we have one — this is
// the active auth path when cross-site cookies are blocked (Vercel↔Render).
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccess();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const NO_REFRESH = [
  "/auth/refresh",
  "/auth/login",
  "/auth/signup",
  "/auth/logout",
];

const shouldAttemptRefresh = (url) =>
  url && !NO_REFRESH.some((path) => url.includes(path));

let refreshInFlight = null;

const performRefresh = async () => {
  const refreshToken = tokenStore.getRefresh();
  // Send the refresh token both ways so the backend can pick either path.
  const body = refreshToken ? { refreshToken } : {};
  const headers = refreshToken
    ? { Authorization: `Bearer ${refreshToken}` }
    : {};
  const { data } = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    body,
    {
      headers,
      withCredentials: true,
    }
  );
  if (data?.accessToken) {
    tokenStore.set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }
  return data;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      shouldAttemptRefresh(original.url)
    ) {
      original._retried = true;
      try {
        if (!refreshInFlight) {
          refreshInFlight = performRefresh();
        }
        await refreshInFlight;
        refreshInFlight = null;
        // Re-apply the new access token on the retry.
        const newToken = tokenStore.getAccess();
        if (newToken) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(original);
      } catch (refreshErr) {
        refreshInFlight = null;
        tokenStore.clear();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
