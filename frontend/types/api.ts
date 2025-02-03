// types/api.ts
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIResponse<T> {
  data: T;
  status: number;
}

export interface FetchOptions {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
  credentials?: RequestCredentials;
}
