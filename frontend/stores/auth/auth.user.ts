// stores/auth/user.auth.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { UserLoginCredentials, User, AuthResponse } from '~/types';

interface UserAuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useUserAuthStore = defineStore('auth/user', {
  state: (): UserAuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.token && state.user),
    isUser: (state): boolean => state.user?.role === 'user',
    userEmail: (state): string | undefined => state.user?.email,
    userPhone: (state): string | undefined => state.user?.phone,
  },

  actions: {
    setAuth(response: AuthResponse) {
      const { setAuthToken } = useApi();

      if (response.entity.role !== 'user') {
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

    async login(credentials: UserLoginCredentials) {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchApi<AuthResponse>('/api/auth/users/login', {
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
        const response = await fetchApi<User>('/api/users/profile');

        if (response && response.role === 'user') {
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
