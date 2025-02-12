// stores/auth/user.auth.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { User, UserLoginCredentials, AuthResponse, ApiResponse } from '~/types';

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
    setAuth(authResponse: AuthResponse) {
      const { setAuthToken } = useApi();

      if (authResponse.entity.role !== 'user') {
        throw new Error('Invalid response entity type');
      }

      this.user = authResponse.entity;
      this.token = authResponse.access_token;
      this.initialized = true;

      setAuthToken(authResponse.access_token);
    },

    clearAuth() {
      const { removeAuthToken } = useApi();

      this.user = null;
      this.token = null;
      this.error = null;
      this.initialized = false;

      removeAuthToken();
    },

    async login(credentials: UserLoginCredentials) {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchApi<AuthResponse>('/api/auth/users/login', {
          method: 'POST',
          body: credentials,
          withCredentials: true,
        });

        // Проверяем наличие данных
        if (!response.data) {
          throw new Error('Invalid response format');
        }

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
      this.loading = true;
      try {
        // Если нужен запрос на сервер при логауте
        const { fetchApi } = useApi();
        await fetchApi('/api/auth/users/logout', {
          method: 'POST',
          withCredentials: true,
        });

        this.clearAuth();
      } catch (error) {
        console.error('Logout error:', error);
        // Всё равно очищаем состояние
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
        const response = await fetchApi<User>('/api/users/profile', {
          withCredentials: true,
        });

        // Проверяем наличие данных и роль
        if (response.data && response.data.role === 'user') {
          this.user = response.data;
          this.token = token;
          this.initialized = true;
        } else {
          this.clearAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        this.clearAuth();
      }
    },

    /**
     * Обновление профиля пользователя
     */
    async refreshProfile() {
      if (!this.isAuthenticated) {
        return;
      }

      const { fetchApi } = useApi();

      try {
        const response = await fetchApi<User>('/api/users/profile', {
          withCredentials: true,
        });

        if (response.data && response.data.role === 'user') {
          this.user = response.data;
        }
      } catch (error) {
        console.error('Profile refresh error:', error);
        // В случае ошибки авторизации clearAuth вызовется через перехватчик в useApi
      }
    },
  },

  persist: {
    paths: ['token', 'user'],
  },
});
