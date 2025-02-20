// stores/admin/cadastral.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { CadastralService, CadastralServiceType, ServiceStatus } from '~/types';
import type { DocumentStatus } from '~/types/documents';

interface CadastralState {
  services: CadastralService[];
  selectedService: CadastralService | null;
  loading: boolean;
  error: string | null;
}

export const useAdminCadastralStore = defineStore('admin/cadastral', {
  state: (): CadastralState => ({
    services: [],
    selectedService: null,
    loading: false,
    error: null,
  }),

  getters: {
    serviceById: (state) => {
      return (id: string) => state.services.find((service) => service.id === id);
    },

    getServicesByUserId: (state) => {
      return (userId: string) => state.services.filter((service) => service.userId === userId);
    },

    getPendingServices: (state) =>
      state.services.filter((service) => service.status !== 'completed' && service.status !== 'rejected'),
  },
  actions: {
    async addUserService(
      userId: string,
      serviceData: {
        type: CadastralServiceType;
        price?: number;
        comment?: string;
      }
    ): Promise<void> {
      this.loading = true;
      try {
        const { fetchApi } = useApi();
        const response = await fetchApi<CadastralService>(`/api/cadastral/users/${userId}/services`, {
          method: 'POST',
          body: serviceData,
        });
        this.services.push(response);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // Получение услуг пользователя
    async getUserServices(userId: string) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<CadastralService[]>(`/api/cadastral/users/${userId}/services`);
        this.services = response;
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Создание новой услуги
    async createService(
      userId: string,
      data: {
        type: string;
        comment?: string;
        price?: number;
      }
    ) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<CadastralService>(`/api/cadastral/users/${userId}/services`, {
          method: 'POST',
          body: data,
        });
        this.services.push(response);
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса услуги
    async updateServiceStatus(serviceId: string, status: ServiceStatus, comment?: string) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<CadastralService>(`/api/cadastral/services/${serviceId}/status`, {
          method: 'PATCH',
          body: { status, comment },
        });

        const index = this.services.findIndex((s) => s.id === serviceId);
        if (index !== -1) {
          this.services[index] = response;
        }

        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса документа
    async updateDocumentStatus(serviceId: string, documentType: string, status: DocumentStatus, comment?: string) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<CadastralService>(
          `/api/cadastral/services/${serviceId}/documents/${documentType}`,
          {
            method: 'PATCH',
            body: { status, comment },
          }
        );

        const index = this.services.findIndex((s) => s.id === serviceId);
        if (index !== -1) {
          this.services[index] = response;
        }

        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса оплаты
    async updatePaymentStatus(serviceId: string, paid: boolean) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<CadastralService>(`/api/cadastral/services/${serviceId}/payment`, {
          method: 'PATCH',
          body: { paid },
        });

        const index = this.services.findIndex((s) => s.id === serviceId);
        if (index !== -1) {
          this.services[index] = response;
        }

        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Получение конкретной услуги
    async getServiceById(serviceId: string) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<CadastralService>(`/api/cadastral/services/${serviceId}`);
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
