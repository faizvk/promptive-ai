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
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Avoid redirect loops if we're already on /login or /signup.
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/signup" && path !== "/") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
