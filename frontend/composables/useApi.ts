// types/api.ts

// Переименуем наш интерфейс, чтобы избежать конфликта
export interface CustomFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  withCredentials?: boolean;
}

// composables/useApi.ts
import { navigateTo, useCookie, useRuntimeConfig } from 'nuxt/app';
import type { ApiResponse, AuthTokens, FetchOptions } from '~/types';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl || ''; // Добавляем дефолтное значение

  const COOKIE_CONFIG = {
    auth: {
      name: 'auth_token',
      options: {
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        httpOnly: true,
      },
    },
  } as const;

  const getAuthToken = (): string | null => {
    const authCookie = useCookie<string>(COOKIE_CONFIG.auth.name);
    return authCookie.value || null;
  };

  const setAuthToken = (token: string): void => {
    const authCookie = useCookie(COOKIE_CONFIG.auth.name, COOKIE_CONFIG.auth.options);
    authCookie.value = token;
  };

  const removeAuthToken = (): void => {
    const authCookie = useCookie(COOKIE_CONFIG.auth.name);
    authCookie.value = null;
  };

  const verifyToken = async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await $fetch<ApiResponse<{ valid: boolean }>>('/api/auth/verify', {
        // Используем as string для явного приведения типа
        baseURL: baseURL as string,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const fetchApi = async <T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
    const token = getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await $fetch<ApiResponse<T>>(url, {
        baseURL: baseURL as string,
        credentials: options.withCredentials ? 'include' : 'same-origin',
        headers,
        method: options.method,
        ...(options.body && {
          body: JSON.stringify(options.body),
        }),
      });

      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        removeAuthToken();
        navigateTo('/login');
      }

      throw new Error(error.response?._data?.message || 'Произошла ошибка при выполнении запроса');
    }
  };

  const refreshToken = async (): Promise<AuthTokens> => {
    try {
      const response = await fetchApi<AuthTokens>('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.data.access_token) {
        setAuthToken(response.data.access_token);
      }

      return response.data;
    } catch (error) {
      removeAuthToken();
      throw error;
    }
  };

  return {
    fetchApi,
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    verifyToken,
    refreshToken,
  };
};
