import { createContext, useContext, useState, useMemo } from "react";
import { createAPI } from "../api/axios";

// ------------------------------
// TYPES
// ------------------------------

type Tokens = {
  access: string;
  refresh: string;
};

type AuthContextType = {
  tokens: Tokens | null;
  isAuthenticated: boolean;
  login: (tokens: Tokens) => void;
  logout: () => void;
  api: ReturnType<typeof createAPI>; // Axios instance with token logic
};

// ------------------------------
// CONSTANTS
// ------------------------------

const TOKENS_STORAGE_KEY = "auth_tokens";

// ------------------------------
// CONTEXT
// ------------------------------

const AuthContext = createContext<AuthContextType | null>(null);

// Load initial tokens from localStorage
const getInitialTokens = (): Tokens | null => {
  const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

// ------------------------------
// PROVIDER
// ------------------------------

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<Tokens | null>(getInitialTokens);

  const login = (newTokens: Tokens) => {
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(newTokens));
    setTokens(newTokens);
  };

  const logout = () => {
    localStorage.removeItem(TOKENS_STORAGE_KEY);
    setTokens(null);
    window.location.href = "/"; // redirect to login
  };

  // Create Axios instance with current token
  const api = useMemo(
    () =>
      createAPI(() => tokens?.access || null), // always get latest token from state
    [tokens]
  );

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isAuthenticated: !!tokens,
        login,
        logout,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ------------------------------
// HOOK
// ------------------------------

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
