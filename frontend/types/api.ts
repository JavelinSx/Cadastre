export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}
