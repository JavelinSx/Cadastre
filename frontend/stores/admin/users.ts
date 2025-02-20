// stores/admin/users.ts
import { defineStore } from 'pinia';

import type { DocumentStatus, DocumentCheckItem } from '~/types/documents';
import type { ServiceStatus, CadastralServiceType, CadastralService } from '~/types/cadastral';
import type { User, UserDocumentChecklist } from '~/types/users';
import { useApi } from '~/composables/useApi';

// Интерфейс состояния стора
interface AdminUsersState {
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

// Интерфейсы для запросов к API
interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
}

interface UpdateDocumentRequest {
  type: string;
  status: DocumentStatus;
  comment?: string;
}

interface UpdateServiceRequest {
  id: string;
  status: ServiceStatus;
  comment?: string;
}

interface UpdateServiceDocumentRequest {
  serviceId: string;
  documentType: string;
  status: DocumentStatus;
  comment?: string;
}

interface UpdatePaymentRequest {
  serviceId: string;
  paid: boolean;
}

interface AddServiceRequest {
  type: CadastralServiceType;
  price?: number;
  comment?: string;
}

// Интерфейсы для ответов API
interface UpdateUserResponse {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  documentChecklists: UserDocumentChecklist[];
  services: CadastralService[];
}

export const useAdminUsersStore = defineStore('admin/users', {
  state: (): AdminUsersState => ({
    selectedUser: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const { fetchApi } = useApi();
        console.log('Fetching user with ID:', id); // Отладочный лог

        const user = await fetchApi<User>(`/api/admin/users/${id}`, {
          method: 'GET',
          withCredentials: true, // Важно для передачи cookies
        });

        this.selectedUser = user;
        return user;
      } catch (error: any) {
        console.error('Error fetching user:', error); // Отладочный лог
        this.error = error.message || 'Ошибка при загрузке пользователя';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // Создание нового клиента
    async createClient(userData: { email?: string; phone?: string; password: string }): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        await fetchApi('/api/admin/users', {
          method: 'POST',
          body: userData,
        });
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса документа
    async updateDocumentStatus(
      userId: string,
      documentType: string,
      status: DocumentStatus,
      comment?: string
    ): Promise<void> {
      return this.updateDocument(userId, {
        type: documentType,
        status,
        comment,
      });
    },
    // Обновление информации о пользователе
    async updateUserInfo(userId: string, data: UpdateUserRequest): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        const response = await fetchApi<UpdateUserResponse>(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          body: data,
        });

        if (this.selectedUser) {
          this.selectedUser = {
            ...this.selectedUser,
            ...response,
          };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление документа пользователя
    async updateDocument(userId: string, data: UpdateDocumentRequest): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        await fetchApi<void>(`/api/admin/users/${userId}/documents/${data.type}`, {
          method: 'PATCH',
          body: {
            status: data.status,
            comment: data.comment,
          },
        });

        if (this.selectedUser?.documentChecklists[0]) {
          const documentIndex = this.selectedUser.documentChecklists[0].documents.findIndex(
            (doc: DocumentCheckItem) => doc.type === data.type
          );

          if (documentIndex !== -1) {
            this.selectedUser.documentChecklists[0].documents[documentIndex] = {
              ...this.selectedUser.documentChecklists[0].documents[documentIndex],
              status: data.status,
              comment: data.comment,
              updatedAt: new Date(),
            };
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса услуги
    async updateService(userId: string, data: UpdateServiceRequest): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        await fetchApi<void>(`/api/cadastral/services/${data.id}/status`, {
          method: 'PATCH',
          body: {
            status: data.status,
            comment: data.comment,
          },
        });

        if (this.selectedUser?.services) {
          const serviceIndex = this.selectedUser.services.findIndex(
            (service: CadastralService) => service.id === data.id
          );

          if (serviceIndex !== -1) {
            this.selectedUser.services[serviceIndex] = {
              ...this.selectedUser.services[serviceIndex],
              status: data.status,
              comment: data.comment,
            };
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление документа услуги
    async updateServiceDocument(data: UpdateServiceDocumentRequest): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        await fetchApi<void>(`/api/cadastral/services/${data.serviceId}/documents/${data.documentType}`, {
          method: 'PATCH',
          body: {
            status: data.status,
            comment: data.comment,
          },
        });

        if (this.selectedUser?.services) {
          const service = this.selectedUser.services.find((s: CadastralService) => s.id === data.serviceId);

          if (service?.documents) {
            const documentIndex = service.documents.findIndex(
              (doc: DocumentCheckItem) => doc.type === data.documentType
            );

            if (documentIndex !== -1) {
              service.documents[documentIndex] = {
                ...service.documents[documentIndex],
                status: data.status,
                comment: data.comment,
                updatedAt: new Date(),
              };
            }
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса оплаты услуги
    async updateServicePayment(data: UpdatePaymentRequest): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        await fetchApi<void>(`/api/cadastral/services/${data.serviceId}/payment`, {
          method: 'PATCH',
          body: { paid: data.paid },
        });

        if (this.selectedUser?.services) {
          const serviceIndex = this.selectedUser.services.findIndex(
            (service: CadastralService) => service.id === data.serviceId
          );

          if (serviceIndex !== -1) {
            this.selectedUser.services[serviceIndex] = {
              ...this.selectedUser.services[serviceIndex],
              payment: data.paid,
            };
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Добавление новой услуги
    async addService(userId: string, data: AddServiceRequest): Promise<CadastralService> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        const newService = await fetchApi<CadastralService>(`/api/cadastral/users/${userId}/services`, {
          method: 'POST',
          body: data,
        });

        if (this.selectedUser && Array.isArray(this.selectedUser.services)) {
          this.selectedUser.services.push(newService);
        }

        return newService;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
