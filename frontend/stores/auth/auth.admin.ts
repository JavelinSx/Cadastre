// stores/auth/admin.auth.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { AdminLoginCredentials, Admin, AuthResponse } from '~/types';

interface AdminAuthState {
  user: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useAdminAuthStore = defineStore('auth/admin', {
  state: (): AdminAuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.token && state.user),
    isAdmin: (state): boolean => state.user?.role === 'admin',
  },

  actions: {
    setAuth(response: AuthResponse) {
      const { fetchApi, setAuthToken } = useApi();

      if (response.entity.role !== 'admin') {
        throw new Error('Invalid response entity type');
      }

      this.user = response.entity;
      this.token = response.access_token;
      this.initialized = true;
      setAuthToken(response.access_token);
    },

    clearAuth() {
      const { clearAuthToken } = useApi();

      this.user = null;
      this.token = null;
      this.error = null;
      this.initialized = false;
      clearAuthToken();
    },

    async login(credentials: AdminLoginCredentials) {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchApi<AuthResponse>('/api/auth/admin/login', {
          method: 'POST',
          body: credentials,
        });

        this.setAuth(response);
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      try {
        this.clearAuth();
      } finally {
        this.loading = false;
      }
    },

    async initializeAuth() {
      const { fetchApi, getAuthToken } = useApi();
      const token = getAuthToken();

      if (!token) {
        this.clearAuth();
        return;
      }

      try {
        const response = await fetchApi<Admin>('/api/admins/profile');

        if (response && response.role === 'admin') {
          this.user = response;
          this.token = token;
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
    paths: ['token', 'user'],
  },
});
