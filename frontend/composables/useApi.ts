// composables/useApi.ts
import type { FetchOptions } from 'ofetch';
import type { APIResponse, HTTPMethod } from '~/types/api';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl as string;

  const fetchApi = <T>(url: string, options: Omit<FetchOptions, 'baseURL'> & { method?: HTTPMethod } = {}) => {
    return $fetch<APIResponse<T>>(url, {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      } as HeadersInit,
      ...options,
    });
  };

  return {
    fetchApi,
  };
};
