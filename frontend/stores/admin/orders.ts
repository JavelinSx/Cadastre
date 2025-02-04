// stores/admin/orders.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { Order, OrderStatus } from '~/types/orders';

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export const useAdminOrdersStore = defineStore('admin/orders', {
  state: (): OrdersState => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
  }),

  getters: {
    getOrdersByStatus: (state) => (status: OrderStatus) => state.orders.filter((order) => order.status === status),

    getUnpaidOrders: (state) => state.orders.filter((order) => !order.payment),

    getOrderById: (state) => (id: string) => state.orders.find((order) => order.id === id),
  },

  actions: {
    // Получение всех заказов
    async fetchOrders() {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Order[]>('/api/admin/orders');
        this.orders = response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Получение заказа по ID
    async fetchOrderById(orderId: string) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Order>(`/api/admin/orders/${orderId}`);
        this.selectedOrder = response;
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса заказа
    async updateOrderStatus(orderId: string, status: OrderStatus, userId: string) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Order>(`/api/admin/orders/${orderId}/status`, {
          method: 'PATCH',
          body: { status },
        });

        const index = this.orders.findIndex((order) => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = response;
        }
        if (this.selectedOrder?.id === orderId) {
          this.selectedOrder = response;
        }
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление информации об оплате
    async updateOrderPayment(orderId: string, payment: boolean) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Order>(`/api/admin/orders/${orderId}/payment`, {
          method: 'PATCH',
          body: { payment },
        });

        const index = this.orders.findIndex((order) => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = response;
        }
        if (this.selectedOrder?.id === orderId) {
          this.selectedOrder = response;
        }
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Сброс состояния
    clearState() {
      this.orders = [];
      this.selectedOrder = null;
      this.error = null;
    },
  },
});
