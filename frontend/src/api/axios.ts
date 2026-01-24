// src/api/axios.ts
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/"; // replace with your Django backend

// create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      const access = JSON.parse(tokens).access;
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
