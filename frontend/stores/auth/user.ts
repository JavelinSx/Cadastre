import { defineStore } from 'pinia';
import type { User } from './types';
interface UserState {
  data: User | null;
}
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    data: {
      id: '1',
      email: 'test@test.com',
      phone: '+79999999999',
      role: 'admin',
    }, // временная заглушка
  }),

  getters: {
    isAdmin: (state) => state.data?.role === 'admin',
    isClient: (state) => state.data?.role === 'client',
  },
  actions: {
    setUser(user: User) {
      this.data = user;
    },
    clearUser() {
      this.data = null;
    },
  },
});
