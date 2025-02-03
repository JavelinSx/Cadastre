// stores/auth/index.ts
import { defineStore } from 'pinia';
import type { APIResponse } from '~/types/api';
import type { AuthState, LoginCredentials, AuthenticatedEntity, LoginResponse, AuthError } from '~/types/auth';
import { useSessionStore } from './session';
import { useClientStore } from './client';
import { useAdminStore } from './admin';

export const handleError = (error: any): AuthError => {
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
};

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
      const { fetchApi, setAuthToken } = useApi();

      this.loading = true;
      this.error = null;

      try {
        // Теперь response содержит данные напрямую
        const response = await fetchApi<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        console.log('Login response:', response); // Для отладки

        if (!response || !response.access_token) {
          throw new Error('Invalid response from server');
        }

        if (!import.meta.server) {
          setAuthToken(response.access_token);
        }

        this.setAuth(response);
        sessionStore.setSession(response.access_token);

        if (response.entity.type === 'admin') {
          adminStore.setAdmin(response.entity);
        } else {
          clientStore.setClient(response.entity);
        }

        return response;
      } catch (error: any) {
        this.error = handleError(error);
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
      const { clearAuthToken } = useApi();
      this.token = null;
      this.entity = null;
      this.isAuthenticated = false;
      this.error = null;
      clearAuthToken(); // Clear token from localStorage
    },

    async logout() {
      const sessionStore = useSessionStore();
      const clientStore = useClientStore();
      const adminStore = useAdminStore();

      this.clearAuth();
      sessionStore.clearSession();
      clientStore.clearClient();
      adminStore.clearAdmin();
    },

    // Add initialization action
    async initializeAuth() {
      const { getAuthToken } = useApi();
      const token = getAuthToken();

      if (token) {
        const sessionStore = useSessionStore();
        sessionStore.setSession(token);
        this.token = token;
        this.isAuthenticated = true;

        // Optionally fetch user profile here to restore entity data
        // await this.fetchProfile();
      }
    },
  },
});
