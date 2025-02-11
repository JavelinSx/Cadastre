// stores/auth/admin.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { Admin } from '~/types';

interface AdminState {
  entity: Admin | null;
  loading: boolean;
  error: string | null;
  initialized: boolean; // Добавляем флаг инициализации
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    entity: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAdmin: (state): boolean => {
      return Boolean(state.entity?.role === 'admin' && state.initialized);
    },
    adminName: (state): string | null => state.entity?.name ?? null,
  },

  actions: {
    setAdmin(admin: Admin) {
      this.entity = {
        id: admin.id,
        role: 'admin',
        name: admin.name,
      };
      this.initialized = true;
    },

    clearAdmin() {
      this.entity = null;
      this.error = null;
      this.initialized = false;
    },

    async fetchProfile() {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Admin>('/api/admins/profile');

        if (response && response.role === 'admin') {
          this.setAdmin(response);
          return response;
        }
        return null;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  persist: {
    paths: ['entity', 'initialized'],
  },
});
