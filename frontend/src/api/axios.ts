// src/api/axios.ts
import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

// Public endpoints that do NOT require JWT
const PUBLIC_ENDPOINTS = ["/api/v1/accounts/register/", "/api/v1/accounts/login/"];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT only for non-public endpoints
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const url = config.url ?? "";

    // Skip token for public endpoints
    if (PUBLIC_ENDPOINTS.some(ep => url.includes(ep))) {
      return config;
    }

    // Ensure headers exist and cast to AxiosRequestHeaders
    config.headers = config.headers ?? {} as AxiosRequestHeaders;

    // Attach token safely
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      const access = JSON.parse(tokens).access;
      config.headers["Authorization"] = `Bearer ${access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
