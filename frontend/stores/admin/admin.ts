// stores/auth/admin.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { Admin } from '~/types';
import { storage, STORAGE_KEYS } from '~/utils/storage';

interface AdminState {
  entity: Admin | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => {
    // Инициализируем состояние из localStorage
    const savedAdmin = storage.get(STORAGE_KEYS.ADMIN);
    return {
      entity: savedAdmin,
      loading: false,
      error: null,
      initialized: Boolean(savedAdmin),
    };
  },

  getters: {
    isAdmin: (state): boolean => {
      return Boolean(state.entity?.role === 'admin' && state.initialized);
    },
    adminName: (state): string | null => state.entity?.login ?? null,
  },

  actions: {
    setAdmin(admin: Admin) {
      this.entity = {
        id: admin.id,
        role: 'admin',
        login: admin.login,
      };
      this.initialized = true;

      // Сохраняем в localStorage
      storage.set(STORAGE_KEYS.ADMIN, this.entity);
    },

    clearAdmin() {
      this.entity = null;
      this.error = null;
      this.initialized = false;

      // Очищаем из localStorage
      storage.remove(STORAGE_KEYS.ADMIN);
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
        // Если профиль не получен или не является админским
        this.clearAdmin();
        return null;
      } catch (error: any) {
        this.error = error.message;
        this.clearAdmin();
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
