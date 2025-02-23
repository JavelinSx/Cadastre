// types/users.ts
import type { DocumentStatus, DocumentCheckItem } from './documents';
import type { CadastralService, ServiceStatus, CadastralServiceType } from './cadastral';

// Чеклист документов пользователя
export interface UserDocumentChecklist {
  serviceId: string;
  documents: DocumentCheckItem[];
  lastUpdated: Date;
  status: DocumentStatus;
}

// Основная модель пользователя
export interface User {
  id: string;
  role: 'user';
  email?: string;
  phone?: string;
  fullName?: string;
  password?: string;
  documentChecklists: UserDocumentChecklist[];
  services: CadastralService[];
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

// Запросы для создания/обновления пользователя
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

// Запросы для управления документами и услугами пользователей (для админа)
export interface UpdateDocumentRequest {
  type: string;
  status: DocumentStatus;
  comment?: string;
}

export interface UpdateServiceRequest {
  id: string;
  status: ServiceStatus;
  comment?: string;
}

export interface UpdateServiceDocumentRequest {
  serviceId: string;
  documentType: string;
  status: DocumentStatus;
  comment?: string;
}

export interface UpdatePaymentRequest {
  serviceId: string;
  paid: boolean;
}

export interface AddServiceRequest {
  type: CadastralServiceType;
  price?: number;
  comment?: string;
}

// Ответы API
export interface UserResponse extends Omit<User, 'password'> {
  documentChecklists: UserDocumentChecklist[];
  services: CadastralService[];
}

export interface UpdateUserResponse {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  documentChecklists: UserDocumentChecklist[];
  services: CadastralService[];
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Типы для фильтрации и состояния админ-стора
export interface UserFilter {
  search?: string;
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminUsersState {
  selectedUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
