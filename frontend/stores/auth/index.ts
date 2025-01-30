// stores/auth/index.ts
import { defineStore } from 'pinia';
import type { APIResponse } from '~/types/api';
import type { AuthState, LoginCredentials, AuthenticatedEntity, LoginResponse, AuthError } from '~/types/auth';
import { useSessionStore } from './session';
import { useClientStore } from './client';
import { useAdminStore } from './admin';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    entity: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    isAdmin: (state) => state.entity?.type === 'admin',
    isUser: (state) => state.entity?.type === 'user',
  },

  actions: {
    async login(credentials: LoginCredentials) {
      const sessionStore = useSessionStore();
      const clientStore = useClientStore();
      const adminStore = useAdminStore();
      const { fetchApi } = useApi();

      this.loading = true;
      this.error = null;

      try {
        const { data } = await fetchApi<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        this.setAuth(data);
        sessionStore.setSession(data.access_token);

        // Set data in appropriate store based on entity type
        if (data.entity.type === 'admin') {
          adminStore.setAdmin(data.entity);
        } else {
          clientStore.setClient(data.entity);
        }

        return data;
      } catch (error: any) {
        this.error = this.handleError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setAuth(data: LoginResponse) {
      this.token = data.access_token;
      this.entity = data.entity;
      this.isAuthenticated = true;
    },

    clearAuth() {
      this.token = null;
      this.entity = null;
      this.isAuthenticated = false;
      this.error = null;
    },

    handleError(error: any): AuthError {
      if (error.response?.status === 401) {
        return 'INVALID_CREDENTIALS';
      }
      if (error.message === 'Network Error') {
        return 'NETWORK_ERROR';
      }
      if (error.response?.status >= 500) {
        return 'SERVER_ERROR';
      }
      return 'UNKNOWN_ERROR';
    },

    async logout() {
      const sessionStore = useSessionStore();
      const clientStore = useClientStore();
      const adminStore = useAdminStore();

      this.clearAuth();
      sessionStore.clearSession();

      // Clear both stores to be safe
      clientStore.clearClient();
      adminStore.clearAdmin();
    },
  },
});
