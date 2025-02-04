// stores/auth/client.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { User } from '~/types/auth';
import { OrderStatus, type Order } from '~/types/orders';

interface ClientState {
  data: User | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export const useClientStore = defineStore('client', {
  state: (): ClientState => ({
    data: null,
    orders: [],
    loading: false,
    error: null,
  }),

  getters: {
    isClient: (state): boolean => state.data?.role === 'user',

    clientEmail: (state): string | undefined => (state.data?.role === 'user' ? state.data.email : undefined),

    clientPhone: (state): string | undefined => (state.data?.role === 'user' ? state.data.phone : undefined),

    activeOrders: (state): Order[] => state.orders.filter((order) => order.status !== OrderStatus.READY),

    completedOrders: (state): Order[] => state.orders.filter((order) => order.status === OrderStatus.READY),

    unpaidOrders: (state): Order[] => state.orders.filter((order) => !order.payment),

    hasError: (state): boolean => state.error !== null,
  },

  actions: {
    setClient(client: User) {
      if (client.role !== 'user') {
        throw new Error('Invalid client type');
      }
      this.data = client;
    },

    clearClient() {
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

    async refreshClientData() {
      try {
        await Promise.all([this.fetchProfile(), this.fetchOrders()]);
      } catch (error: any) {
        this.error = error.message || 'Failed to refresh client data';
        throw error;
      }
    },
  },

  persist: {
    paths: ['data'],
  },
});
