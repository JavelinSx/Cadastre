// types/auth.ts

// Базовые типы для пользователей системы
interface BaseEntity {
  id: string;
  role: 'admin' | 'user';
}

export interface Admin extends BaseEntity {
  role: 'admin';
  name: string;
}

export interface User extends BaseEntity {
  role: 'user';
  email?: string;
  phone?: string;
}

// Тип для авторизованной сущности (admin или user)
export type AuthenticatedEntity = Admin | User;

// Состояние авторизации
export interface AuthState {
  entity: AuthenticatedEntity | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Данные для входа
export interface LoginCredentials {
  login: string; // может быть email, phone или name админа
  password: string;
}

// Ответ от сервера при успешной авторизации
export interface LoginResponse {
  access_token: string;
  entity: AuthenticatedEntity;
}

// Type guards для проверки типа сущности
export const isAdmin = (entity: AuthenticatedEntity): entity is Admin => {
  return entity.role === 'admin';
};

export const isUser = (entity: AuthenticatedEntity): entity is User => {
  return entity.role === 'user';
};

// Типы для создания пользователя (используется админом)
export interface CreateUserData {
  email?: string;
  phone?: string;
  password: string;
}

// Типы ошибок аутентификации
export type AuthError = 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';

// Интерфейс для ответа с ошибкой
export interface AuthErrorResponse {
  error: AuthError;
  message: string;
}
