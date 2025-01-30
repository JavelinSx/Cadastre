// types/auth.types.ts
export interface JwtPayload {
  sub: string;
  type: 'admin' | 'user';
  name?: string;
  email?: string;
}
