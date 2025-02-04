// stores/auth/index.ts
import { defineStore } from 'pinia';
import type { APIResponse } from '~/types/api';
import type {
  AuthState,
  LoginCredentials,
  AuthenticatedEntity,
  LoginResponse,
  AuthError,
  Admin,
  User,
} from '~/types/auth';
import { useSessionStore } from './session';
import { useClientStore } from './client';
import { useAdminStore } from './admin';
import { useApi } from '~/composables/useApi';

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
    isAdmin: (state) => state.entity?.role === 'admin',
    isUser: (state) => state.entity?.role === 'user',
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

        if (!response || !response.access_token) {
          throw new Error('Invalid response from server');
        }

        if (!import.meta.server) {
          setAuthToken(response.access_token);
        }

        this.setAuth(response);
        sessionStore.setSession(response.access_token);

        if (response.entity.role === 'admin') {
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
      clearAuthToken();
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
      const { getAuthToken, fetchApi } = useApi();
      const token = getAuthToken();

      if (token) {
        try {
          const adminProfile = await fetchApi<Admin>('/api/admins/profile');

          if (adminProfile && adminProfile.role === 'admin') {
            // Если получили профиль - тогда уже устанавливаем все состояния
            const sessionStore = useSessionStore();
            const adminStore = useAdminStore();

            sessionStore.setSession(token);
            this.token = token;
            this.isAuthenticated = true;

            adminStore.setAdmin(adminProfile);
            this.entity = adminProfile;
          }
        } catch (error) {
          // При ошибке очищаем всё
          this.clearAuth();
        }
      }
    },
  },
  persist: {
    paths: ['entity', 'token', 'isAuthenticated', 'loading', 'error'],
  },
});
