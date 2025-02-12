// stores/auth.admin.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { Admin, AdminLoginCredentials, AuthResponse, ApiResponse } from '~/types';

interface AdminAuthState {
  user: Admin | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useAdminAuthStore = defineStore('auth/admin', {
  state: (): AdminAuthState => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.user),
    isAdmin: (state): boolean => state.user?.role === 'admin',
  },

  actions: {
    setAuth(response: AuthResponse) {
      if (response.entity.role !== 'admin') {
        throw new Error('Invalid response entity type');
      }
      this.user = response.entity;
      this.initialized = true;
    },

    clearAuth() {
      this.user = null;
      this.error = null;
      this.initialized = false;
    },

    async login(credentials: AdminLoginCredentials) {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        // Здесь указываем, что ожидаем AuthResponse внутри ApiResponse
        const response = await fetchApi<AuthResponse>('/api/auth/admin/login', {
          method: 'POST',
          body: credentials,
          withCredentials: true,
        });

        // Теперь response.data содержит AuthResponse
        this.setAuth(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        await fetchApi('/api/auth/admin/logout', {
          method: 'POST',
          withCredentials: true,
        });
        this.clearAuth();
      } finally {
        this.loading = false;
      }
    },

    async initializeAuth() {
      const { fetchApi } = useApi();

      try {
        // Здесь мы ожидаем Admin внутри ApiResponse
        const response = await fetchApi<Admin>('/api/admins/profile', {
          withCredentials: true,
        });

        // response.data содержит Admin
        if (response.data && response.data.role === 'admin') {
          this.user = response.data;
          this.initialized = true;
        } else {
          this.clearAuth();
        }
      } catch {
        this.clearAuth();
      }
    },
  },

  persist: {
    paths: ['user', 'initialized'],
  },
});
