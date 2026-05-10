import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL && import.meta.env.MODE !== "test") {
  console.warn(
    "VITE_API_BASE_URL is not set. API requests will fail. " +
      "Copy frontend/.env.example to .env.local and set it."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  // httpOnly auth cookies are sent with every request to the backend.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints that should NOT trigger an automatic refresh on 401:
// - /auth/refresh itself (would loop)
// - /auth/login + /auth/signup (caller handles credential errors)
// - /auth/logout (already losing session)
const NO_REFRESH = [
  "/auth/refresh",
  "/auth/login",
  "/auth/signup",
  "/auth/logout",
];

const shouldAttemptRefresh = (url) =>
  url && !NO_REFRESH.some((path) => url.includes(path));

let refreshInFlight = null;

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
        // De-dupe: if a refresh is already in flight, wait for it.
        if (!refreshInFlight) {
          refreshInFlight = api.post("/auth/refresh");
        }
        await refreshInFlight;
        refreshInFlight = null;
        return api(original);
      } catch (refreshErr) {
        refreshInFlight = null;
        // Refresh itself failed — fall through and let the caller see 401.
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
