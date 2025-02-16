// stores/auth/auth.user.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { User, UserLoginCredentials, AuthResponse } from '~/types';
import { storage, STORAGE_KEYS } from '~/utils/storage';

interface UserAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useUserAuthStore = defineStore('auth/user', {
  state: (): UserAuthState => {
    // Инициализация состояния из localStorage
    const savedData = storage.get(STORAGE_KEYS.USER);
    return {
      user: savedData,
      loading: false,
      error: null,
      initialized: Boolean(savedData),
    };
  },

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.user),
    isUser: (state): boolean => state.user?.role === 'user',
    userEmail: (state): string | undefined => state.user?.email,
    userPhone: (state): string | undefined => state.user?.phone,
  },

  actions: {
    setAuth(authResponse: AuthResponse) {
      if (authResponse.entity.role !== 'user') {
        throw new Error('Invalid response entity type');
      }

      this.user = authResponse.entity;
      this.initialized = true;

      // Сохраняем в localStorage
      storage.set(STORAGE_KEYS.USER, authResponse.entity);
    },

    clearAuth() {
      this.user = null;
      this.error = null;
      this.initialized = false;

      // Очищаем из localStorage
      storage.remove(STORAGE_KEYS.USER);
    },

    async login(credentials: UserLoginCredentials) {
      this.loading = true;
      this.error = null;

      try {
        const { fetchApi } = useApi();
        const response = await fetchApi<AuthResponse>('/api/auth/users/login', {
          method: 'POST',
          body: credentials,
          withCredentials: true,
        });

        if (!response) {
          throw new Error('Invalid response format');
        }

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
        const { fetchApi } = useApi();
        await fetchApi('/api/auth/users/logout', {
          method: 'POST',
          withCredentials: true,
        });
        this.clearAuth();
      } catch (error) {
        console.error('Logout error:', error);
        this.clearAuth();
      } finally {
        this.loading = false;
      }
    },

    async initializeAuth() {
      const { fetchApi } = useApi();

      try {
        const response = await fetchApi<User>('/api/users/profile', {
          withCredentials: true,
        });

        if (response && response.role === 'user') {
          this.user = response;
          this.initialized = true;
          storage.set(STORAGE_KEYS.USER, response);
        } else {
          this.clearAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        this.clearAuth();
      }
    },

    async refreshProfile() {
      if (!this.isAuthenticated) return;

      const { fetchApi } = useApi();

      try {
        const response = await fetchApi<User>('/api/users/profile', {
          withCredentials: true,
        });

        if (response && response.role === 'user') {
          this.user = response;
          storage.set(STORAGE_KEYS.USER, response);
        }
      } catch (error) {
        console.error('Profile refresh error:', error);
      }
    },
  },
});
