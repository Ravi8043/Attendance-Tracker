export interface LoginPayLoad {
    id_card_number: string;
    password: string;
}

export interface RegisterPayLoad {
    username : string;
    id_card_number: string;
    password: string;
    password2: string;
}

// tokens returned from backend after login/register and their types
export interface AuthTokens {
    access: string;
    refresh: string;
}

// the user info sends along with the tokens
export interface AuthUser{
    username ?: string;
    id_card_number ?: string;
}
// the shape of object stored in state like useState or useReducer
export interface AuthState {
    token: AuthTokens | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
}

// the response types from backend after login/register
export interface AuthResponse {
    token: AuthTokens;
    user: AuthUser;
}
// the error response type from backend after failed login/register
export interface ErrorResponse {
    detail: string;
}

// the payload and response types for refreshing tokens of access tokens
export interface RefreshTokenPayLoad {
    refresh: string;
}
export interface RefreshTokenResponse {
    access: string;
}  


export interface AuthContextType {
    user: AuthUser | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    //types of functions to login, register and logout new users
    login: (data: LoginPayLoad) => Promise<void>;
    register: (data: RegisterPayLoad) => Promise<void>;
    logout: () => void;
}