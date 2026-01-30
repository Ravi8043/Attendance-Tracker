import type  {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";
// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TokenResponse {
  access: string;
  refresh: string;
}

interface StoredTokens {
  access: string;
  refresh: string;
}

interface RefreshTokenResponse {
  access: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PUBLIC_ENDPOINTS = [
  "/api/v1/accounts/register/",
  "/api/v1/accounts/token/",
  "/api/v1/accounts/token/refresh/",
] as const;

const TOKEN_STORAGE_KEY = "auth_tokens";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if the endpoint is public (doesn't require authentication)
 */
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

/**
 * Safely retrieve tokens from localStorage
 */
const getStoredTokens = (): StoredTokens | null => {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;

    const tokens = JSON.parse(stored) as StoredTokens;
    if (!tokens.access || !tokens.refresh) {
      console.warn("Invalid token structure in localStorage");
      return null;
    }

    return tokens;
  } catch (error) {
    console.error("Error parsing stored tokens:", error);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
};

/**
 * Store tokens in localStorage
 */
const setStoredTokens = (tokens: StoredTokens): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

/**
 * Remove tokens from localStorage
 */
const clearStoredTokens = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

/**
 * Redirect to login page
 */
const redirectToLogin = (): void => {
  const currentPath = window.location.pathname;
  const returnUrl = currentPath !== "/" ? `?returnUrl=${encodeURIComponent(currentPath)}` : "";
  window.location.href = `/${returnUrl}`;
};

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// TOKEN REFRESH LOGIC
// ============================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  const tokens = getStoredTokens();
  
  if (!tokens?.refresh) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/accounts/token/refresh/`,
      { refresh: tokens.refresh },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const newAccessToken = response.data.access;
    
    // Update stored tokens with new access token
    setStoredTokens({
      access: newAccessToken,
      refresh: tokens.refresh,
    });

    return newAccessToken;
  } catch (error) {
    clearStoredTokens();
    throw error;
  }
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const url = config.url || "";

    // Skip authentication for public endpoints
    if (isPublicEndpoint(url)) {
      return config;
    }

    // Add JWT access token to headers
    const tokens = getStoredTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest?.url || "";

    // Handle 401 Unauthorized
    if (status === 401 && !isPublicEndpoint(url)) {
      // Prevent infinite retry loop
      if (originalRequest._retry) {
        clearStoredTokens();
        redirectToLogin();
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const tokens = getStoredTokens();
            if (tokens?.access) {
              originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        clearStoredTokens();
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.error("Access forbidden:", url);
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.error("Resource not found:", url);
    }

    // Handle 500+ Server Errors
    if (status >= 500) {
      console.error("Server error:", status, url);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// EXPORT
// ============================================================================

export default api;

// Export utility functions for use in auth flows
export { getStoredTokens, setStoredTokens, clearStoredTokens, type StoredTokens, type TokenResponse };