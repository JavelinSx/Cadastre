// composables/useApi.ts
import type { FetchOptions, APIResponse } from '~/types/api';
import type { LoginResponse } from '~/types/auth';

const AUTH_TOKEN_KEY = 'auth_token';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const getAuthToken = () => {
    if (import.meta.server) return null;
    try {
      return window.localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
      return null;
    }
  };

  const setAuthToken = (token: string) => {
    if (import.meta.server) return;
    try {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (e) {
      console.warn('Failed to save token to localStorage:', e);
    }
  };

  const clearAuthToken = () => {
    if (import.meta.server) return;
    try {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to remove token from localStorage:', e);
    }
  };

  const fetchApi = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
    const token = getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await $fetch(url, {
        baseURL,
        credentials: 'include',
        headers,
        timeout: 10000,
        ...options,
        ...(options.body
          ? {
              body: typeof options.body === 'string' ? options.body : JSON.stringify(options.body),
            }
          : {}),
      });

      // Теперь мы возвращаем сам ответ, а не оборачиваем его в { data }
      return response as T;
    } catch (error: any) {
      console.error('API Error:', error);

      // Проверяем, есть ли у ошибки response
      if (error.response) {
        const errorMessage = error.response._data?.message || 'Ошибка авторизации. Попробуйте позже';
        throw new Error(errorMessage);
      }

      throw new Error('Ошибка сети. Попробуйте позже');
    }
  };

  return {
    fetchApi,
    setAuthToken,
    clearAuthToken,
    getAuthToken,
  };
};
