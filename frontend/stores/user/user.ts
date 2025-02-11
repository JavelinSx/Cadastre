// stores/auth/user.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import { type User, type Order, OrderStatus } from '~/types';

interface UserState {
  data: User | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    data: null,
    orders: [],
    loading: false,
    error: null,
  }),

  getters: {
    isUser: (state): boolean => state.data?.role === 'user',

    userEmail: (state): string | undefined => (state.data?.role === 'user' ? state.data.email : undefined),

    userPhone: (state): string | undefined => (state.data?.role === 'user' ? state.data.phone : undefined),

    activeOrders: (state): Order[] => state.orders.filter((order) => order.status !== OrderStatus.READY),

    completedOrders: (state): Order[] => state.orders.filter((order) => order.status === OrderStatus.READY),

    unpaidOrders: (state): Order[] => state.orders.filter((order) => !order.payment),

    hasError: (state): boolean => state.error !== null,
  },

  actions: {
    setUser(user: User) {
      if (user.role !== 'user') {
        throw new Error('Invalid user type');
      }
      this.data = user;
    },

    clearUser() {
      this.data = null;
      this.orders = [];
      this.error = null;
    },

    async fetchProfile() {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchApi<User>('/api/users/profile');

        if (response && response.role === 'user') {
          this.data = {
            id: response.id,
            role: 'user',
            email: response.email,
            phone: response.phone,
          };
        } else {
          throw new Error('Invalid profile data received');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrders() {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchApi<Order[]>('/api/users/orders');

        if (Array.isArray(response)) {
          this.orders = response;
        } else {
          throw new Error('Invalid orders data received');
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch orders';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async refreshUserData() {
      try {
        await Promise.all([this.fetchProfile(), this.fetchOrders()]);
      } catch (error: any) {
        this.error = error.message || 'Failed to refresh user data';
        throw error;
      }
    },
  },

  persist: {
    paths: ['data'],
  },
});
