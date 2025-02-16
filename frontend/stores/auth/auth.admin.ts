// stores/auth/auth.admin.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { Admin, AdminLoginCredentials, AuthResponse } from '~/types';
import { storage, STORAGE_KEYS } from '~/utils/storage';

interface AdminAuthState {
  user: Admin | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useAdminAuthStore = defineStore('auth/admin', {
  state: (): AdminAuthState => {
    // Проверяем, что мы на клиенте
    const isClient = process.client;
    const savedData = isClient ? storage.get(STORAGE_KEYS.ADMIN) : null;

    return {
      user: savedData,
      loading: false,
      error: null,
      initialized: Boolean(savedData),
    };
  },

  getters: {
    isAuthenticated(): boolean {
      return Boolean(this.user?.role === 'admin' && this.initialized);
    },

    isAdmin(): boolean {
      return this.user?.role === 'admin';
    },
  },

  actions: {
    setAuth(authData: AuthResponse) {
      if (authData.entity.role !== 'admin') {
        throw new Error('Invalid entity type');
      }

      this.user = authData.entity;
      this.initialized = true;

      if (process.client) {
        storage.set(STORAGE_KEYS.ADMIN, authData.entity);
      }
    },

    clearAuth() {
      this.user = null;
      this.error = null;
      this.initialized = false;

      if (process.client) {
        storage.remove(STORAGE_KEYS.ADMIN);
      }
    },

    async login(credentials: AdminLoginCredentials) {
      this.loading = true;
      this.error = null;

      try {
        const { fetchApi } = useApi();
        const authData = await fetchApi<AuthResponse>('/api/auth/admin/login', {
          method: 'POST',
          body: credentials,
          withCredentials: true,
        });

        this.setAuth(authData);
        return authData;
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
        const { fetchApi } = useApi();
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
      if (!process.client) return;

      const { fetchApi } = useApi();

      try {
        const admin = await fetchApi<Admin>('/api/admins/profile', {
          withCredentials: true,
        });

        if (admin && admin.role === 'admin') {
          this.user = admin;
          this.initialized = true;
          storage.set(STORAGE_KEYS.ADMIN, admin);
        } else {
          this.clearAuth();
        }
      } catch (error) {
        this.clearAuth();
      }
    },
  },
});
