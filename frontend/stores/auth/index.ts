// stores/auth/index.ts
import { defineStore } from 'pinia';
import { useSessionStore } from './session';
import { useUserStore } from './user';
import type { User } from './types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async login(credentials: LoginCredentials) {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();

      this.loading = true;
      this.error = null;

      try {
        // Имитация API запроса
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });

        if (!response.ok) throw new Error('Login failed');

        const { token, user } = await response.json();

        sessionStore.setSession(token);
        userStore.setUser(user);
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const sessionStore = useSessionStore();
      const userStore = useUserStore();

      this.loading = true;

      try {
        // Имитация API запроса
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionStore.token}`,
          },
        });
      } finally {
        sessionStore.clearSession();
        userStore.clearUser();
        this.loading = false;
      }
    },
  },
});
