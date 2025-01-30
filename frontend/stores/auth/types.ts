// stores/auth/types.ts
export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'admin' | 'client' | null;
}

export interface Session {
  token: string | null;
  authenticated: boolean;
}
