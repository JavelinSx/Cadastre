// types/user.ts
import type { DocumentStatus, DocumentCheckItem } from './documents';
import type { CadastralService } from './cadastral';

export interface UserDocumentChecklist {
  serviceId: string;
  documents: DocumentCheckItem[];
  lastUpdated: Date;
  status: DocumentStatus;
}

export interface User {
  id: string;
  role: 'user';
  email?: string;
  phone?: string;
  fullName?: string;
  password?: string;
  documentChecklists: UserDocumentChecklist[];
  services: CadastralService[]; // Добавляем поле services
  interactions: {
    id: string;
    type: 'call' | 'chat' | 'office';
    date: Date;
    description: string;
    adminId: string;
  }[];
  isBlocked: boolean;
  blockReason?: string;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email?: string;
  phone?: string;
  password: string;
  fullName?: string;
}

export interface UpdateUserRequest {
  email?: string;
  phone?: string;
  fullName?: string;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface UserResponse extends Omit<User, 'password'> {
  documentChecklists: UserDocumentChecklist[];
  services: CadastralService[];
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

// Типы для фильтрации и сортировки
export interface UserFilter {
  search?: string;
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
