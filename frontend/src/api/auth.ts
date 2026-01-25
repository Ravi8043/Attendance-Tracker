import api from "./axios";
import type { LoginPayLoad, RegisterPayLoad, AuthTokens } from "../types/auth";

// login API
// sends username and password, receives access and refresh tokens
export const login = async (data: LoginPayLoad): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>("/api/v1/accounts/token/", data);
  return response.data;
};

// register API
export const register = async (data: RegisterPayLoad): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>("/api/v1/accounts/register/", data);
  return response.data;
};

// optional: logout API (if you have server-side blacklisting)
export const logout = async (): Promise<void> => {
  // if your backend has logout API, call it here
  // await api.post("/api/v1/accounts/logout/");
  // for now, frontend-only logout will just clear localStorage
};
