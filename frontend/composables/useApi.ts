// composables/useApi.ts
import { navigateTo, useRuntimeConfig } from 'nuxt/app';
import type { ApiResponse, FetchOptions } from '~/types';
import { useAdminAuthStore } from '~/stores/auth/auth.admin';
import { useUserAuthStore } from '~/stores/auth/auth.user';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl || '';

  const determineAuthType = (url: string): 'admin' | 'user' | null => {
    const adminStore = useAdminAuthStore();
    const userStore = useUserAuthStore();

    // Определяем тип по URL и текущей авторизации
    if (url.includes('/api/admin') && adminStore.isAuthenticated) return 'admin';
    if (url.includes('/api/users') && userStore.isAuthenticated) return 'user';
    if (adminStore.isAuthenticated) return 'admin';
    if (userStore.isAuthenticated) return 'user';
    return null;
  };

  const handleApiError = (error: any, url: string) => {
    const adminStore = useAdminAuthStore();
    const userStore = useUserAuthStore();

    if (error.response?.status === 401) {
      const authType = determineAuthType(url);

      // Очищаем авторизацию только для соответствующего типа запроса
      if (authType === 'admin' && url.includes('/api/admin')) {
        adminStore.clearAuth();
        navigateTo('/login-admin');
      } else if (authType === 'user' && url.includes('/api/users')) {
        userStore.clearAuth();
        navigateTo('/login');
      }
    }

    const enhancedError = new Error(error.response?.data?.message || error.message || 'Unknown error occurred');
    enhancedError.cause = error;
    throw enhancedError;
  };

  const fetchApi = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
    try {
      const response = await $fetch<T>(url, {
        baseURL,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
        },
        method: options.method || 'GET',
        ...(options.body && {
          body: JSON.stringify(options.body),
        }),
      });

      return response;
    } catch (error: any) {
      return handleApiError(error, url);
    }
  };

  const isSuccessStatus = (status: number): boolean => status >= 200 && status < 300;
  const isClientError = (status: number): boolean => status >= 400 && status < 500;
  const isServerError = (status: number): boolean => status >= 500;

  return {
    fetchApi,
    isSuccessStatus,
    isClientError,
    isServerError,
  };
};
