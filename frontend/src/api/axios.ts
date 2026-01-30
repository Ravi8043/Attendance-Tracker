import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const PUBLIC_ENDPOINTS = [
  "/api/v1/accounts/register/",
  "/api/v1/accounts/token/",
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // important for cookies/session
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- REQUEST INTERCEPTOR ----------------
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const url = config.url || "";

    // Skip adding Authorization for public endpoints
    const isPublic = PUBLIC_ENDPOINTS.some(ep => url.includes(ep));
    if (isPublic) return config;

    // Add JWT token from localStorage
    const stored = localStorage.getItem("tokens");
    if (stored) {
      const { access } = JSON.parse(stored);
      if (access) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${access}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE INTERCEPTOR ----------------
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Auto logout if unauthorized and not a public endpoint
    if (status === 401 && !PUBLIC_ENDPOINTS.some(ep => url.includes(ep))) {
      localStorage.removeItem("tokens");
      // optional: redirect to login
      // window.location.href = "/"; 
    }

    return Promise.reject(error);
  }
);

export default api;
