// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'operator';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
