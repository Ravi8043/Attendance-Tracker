import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

interface RefreshTokenResponse { access: string; }
interface StoredTokens { access: string; refresh: string; }

const PUBLIC_ENDPOINTS = [
  "/api/v1/accounts/register/",
  "/api/v1/accounts/token/",
  "/api/v1/accounts/token/refresh/",
] as const;

export const createAPI = (getAccessToken: () => string | null) => {
  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
    timeout: 30000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (val?: unknown) => void; reject: (err?: unknown) => void; }> = [];

  const processQueue = (error: Error | null = null) => {
    failedQueue.forEach(p => error ? p.reject(error) : p.resolve());
    failedQueue = [];
  };

  const refreshAccessToken = async (): Promise<string> => {
    const tokensStr = localStorage.getItem("auth_tokens");
    if (!tokensStr) throw new Error("No refresh token found");
    const tokens = JSON.parse(tokensStr) as StoredTokens;

    const res = await axios.post<RefreshTokenResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/accounts/token/refresh/`,
      { refresh: tokens.refresh },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const newAccessToken = res.data.access;
    localStorage.setItem("auth_tokens", JSON.stringify({ ...tokens, access: newAccessToken }));
    return newAccessToken;
  };

  api.interceptors.request.use(config => {
    if (!PUBLIC_ENDPOINTS.some(ep => config.url?.includes(ep))) {
      const token = getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && !PUBLIC_ENDPOINTS.some(ep => originalRequest.url?.includes(ep))) {
        if (originalRequest._retry) {
          localStorage.removeItem("auth_tokens");
          window.location.href = "/";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            const token = getAccessToken();
            if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue();
          return api(originalRequest);
        } catch (err) {
          processQueue(err as Error);
          localStorage.removeItem("auth_tokens");
          window.location.href = "/";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
