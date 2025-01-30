// stores/auth/admin.ts
import { defineStore } from 'pinia';
import type { Admin } from '~/types/auth';
import type { APIResponse } from '~/types/api';

interface AdminState {
  data: Admin | null;
  loading: boolean;
  error: string | null;
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    data: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAdmin: (state): boolean => state.data?.type === 'admin',
    adminName: (state): string | null => state.data?.name ?? null,
  },

  actions: {
    setAdmin(admin: Admin) {
      this.data = admin;
    },

    clearAdmin() {
      this.data = null;
      this.error = null;
    },

    async fetchProfile() {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const { data } = await fetchApi<Admin>('/api/admins/profile');
        // Теперь data это Admin из APIResponse
        if (data && data.type === 'admin') {
          this.data = {
            id: data.id,
            type: 'admin',
            name: data.name,
          };
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
