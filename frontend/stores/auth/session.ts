// stores/auth/session.ts
import { defineStore } from 'pinia';
import type { Session } from './types';

export const useSessionStore = defineStore('auth/session', {
  state: (): Session => ({
    token: null,
    authenticated: false,
  }),

  getters: {
    isAuthenticated: (state) => state.authenticated,
  },

  actions: {
    setSession(token: string) {
      this.token = token;
      this.authenticated = true;
    },

    clearSession() {
      this.token = null;
      this.authenticated = false;
    },
  },
  persist: {
    paths: ['token', 'authenticated'],
  },
});
