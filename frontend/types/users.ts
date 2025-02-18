import type { DocumentStatus, UserDocumentChecklist } from './documents';

// types/user.ts
export interface User {
  id: string;
  role: 'user';
  email?: string;
  phone?: string;
  fullName?: string;
  password?: string;
  documentChecklists: UserDocumentChecklist[];
  interactions: Interaction[];
  isBlocked: boolean;
  blockReason?: string;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interaction {
  id: string;
  date: Date;
  type: InteractionType;
  description: string;
  adminId: string;
}

export type InteractionType = 'call' | 'chat' | 'office';

export interface CreateUserDto {
  email?: string;
  phone?: string;
  password: string;
  fullName?: string;
}

export interface UpdateUserDto {
  email?: string;
  phone?: string;
  fullName?: string;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface BlockUserDto {
  isBlocked: boolean;
  reason?: string;
}

export interface UserResponse {
  id: string;
  role: 'user';
  email?: string;
  phone?: string;
  fullName?: string;
  documentChecklists: UserDocumentChecklist[];
  interactions: Interaction[];
  isBlocked: boolean;
  blockReason?: string;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
  commonDocumentsStatus: DocumentStatus;
}

export interface UserFilter {
  search?: string;
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UsersListResponse {
  users: UserResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
