import { createContext, useContext, useState } from "react";

type Tokens = {
  access: string;
  refresh: string;
};

type AuthContextType = {
  tokens: Tokens | null;
  isAuthenticated: boolean;
  login: (tokens: Tokens) => void;
  logout: () => void;
};

const TOKENS_STORAGE_KEY = "auth_tokens";

const AuthContext = createContext<AuthContextType | null>(null);

const getInitialTokens = (): Tokens | null => {
  const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<Tokens | null>(getInitialTokens);

  const login = (newTokens: Tokens) => {
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(newTokens));
    setTokens(newTokens);
  };

  const logout = () => {
    localStorage.removeItem(TOKENS_STORAGE_KEY);
    setTokens(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isAuthenticated: !!tokens,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};