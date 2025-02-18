// types/auth.ts

import type { User } from './users';

// Базовые типы
interface BaseEntity {
  id: string;
  role: 'admin' | 'user';
}

export interface Admin extends BaseEntity {
  role: 'admin';
  login: string;
}

export type AuthenticatedEntity = Admin | User;

// Типы для входа
export interface AdminLoginCredentials {
  login: string;
  password: string;
}

export interface UserLoginCredentials {
  login: string;
  password: string;
}

// Состояния авторизации
export interface AdminAuthState {
  entity: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserAuthState {
  entity: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  access_token: string;
  entity: Admin | User;
}

// Type guards
export const isAdmin = (entity: AuthenticatedEntity): entity is Admin => {
  return entity.role === 'admin';
};

export const isUser = (entity: AuthenticatedEntity): entity is User => {
  return entity.role === 'user';
};

// Создание пользователя
export interface CreateUserData {
  email?: string;
  phone?: string;
  password: string;
}

// Ошибки
export type AuthError = 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';

export interface AuthErrorResponse {
  error: AuthError;
  message: string;
}

export interface Session {
  token: string | null;
  authenticated: boolean;
}
