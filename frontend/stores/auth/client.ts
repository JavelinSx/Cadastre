// stores/auth/client.ts
import { defineStore } from 'pinia';
import type { User } from '~/types/auth';
import type { Order } from '~/types/orders';
import type { APIResponse } from '~/types/api';

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
    isClient: (state): boolean => state.data?.type === 'user',
    clientEmail: (state): string | undefined => state.data?.email,
    clientPhone: (state): string | undefined => state.data?.phone,
    activeOrders: (state) => state.orders.filter((order) => order.status !== 'ready_for_issue'),
    completedOrders: (state) => state.orders.filter((order) => order.status === 'ready_for_issue'),
    unpaidOrders: (state) => state.orders.filter((order) => !order.payment),
  },

  actions: {
    setClient(client: User) {
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

      try {
        const { data } = await fetchApi<User>('/api/users/profile');
        if (data.type === 'user') {
          this.data = {
            id: data.id,
            type: data.type,
            email: data.email,
            phone: data.phone,
          };
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrders() {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const { data } = await fetchApi<Order[]>('/api/users/orders');
        this.orders = data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
