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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<Tokens | null>(() => {
    const stored = localStorage.getItem("tokens");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (tokens: Tokens) => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
    setTokens(tokens);
  };

  const logout = () => {
    localStorage.removeItem("tokens");
    setTokens(null);
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
