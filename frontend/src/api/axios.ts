import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const PUBLIC_ENDPOINTS = [
  "/api/v1/accounts/register/",
  "/api/v1/accounts/token/",
];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url ?? "";

    const isPublic = PUBLIC_ENDPOINTS.some(ep => url.includes(ep));
    if (isPublic) return config;

    const stored = localStorage.getItem("tokens");
    if (stored) {
      const { access } = JSON.parse(stored);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("tokens");
    }
    return Promise.reject(err);
  }
);

export default api;
