// types/auth.types.ts
export type UserRole = 'admin' | 'user';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  email?: string;
  login?: string;
}

export interface AuthResponse {
  access_token: string;
  entity: AdminEntity | UserEntity;
}

export interface BaseEntity {
  id: string;
  role: UserRole;
}

export interface AdminEntity extends BaseEntity {
  role: 'admin';
  login: string;
}

export interface UserEntity extends BaseEntity {
  role: 'user';
  email?: string;
  phone?: string;
}
