// stores/admin/users.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { User, CreateUserData } from '~/types';
import type { Order, OrderStatus } from '~/types';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  userOrders: Order[];
  loading: boolean;
  error: string | null;
}

export const useAdminUsersStore = defineStore('admin/users', {
  state: (): UsersState => ({
    users: [],
    selectedUser: null,
    userOrders: [],
    loading: false,
    error: null,
  }),

  getters: {
    getUserById: (state) => (id: string) => state.users.find((user) => user.id === id),

    getUserOrders: (state) => (userId: string) => state.userOrders.filter((order) => order.userId === userId),
  },

  actions: {
    // Получение списка пользователей
    async fetchUsers() {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<User[]>('/api/admin/users');
        this.users = response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Создание нового пользователя
    async createUser(userData: CreateUserData) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<User>('/api/admin/users', {
          method: 'POST',
          body: userData,
        });

        this.users.push(response);
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Удаление пользователя
    async deleteUser(userId: string) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        await fetchApi(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        this.users = this.users.filter((user) => user.id !== userId);
        if (this.selectedUser?.id === userId) {
          this.selectedUser = null;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление пользователя
    async updateUser(userId: string, userData: Partial<CreateUserData>) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<User>(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          body: userData,
        });

        const index = this.users.findIndex((user) => user.id === userId);
        if (index !== -1) {
          this.users[index] = response;
        }
        if (this.selectedUser?.id === userId) {
          this.selectedUser = response;
        }
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Получение заказов пользователя
    async fetchUserOrders(userId: string) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Order[]>(`/api/admin/users/${userId}/orders`);
        this.userOrders = response;
        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Обновление статуса заказа
    async updateOrderStatus(orderId: string, status: OrderStatus) {
      const { fetchApi } = useApi();
      this.loading = true;

      try {
        const response = await fetchApi<Order>(`/api/admin/orders/${orderId}/status`, {
          method: 'PATCH',
          body: { status },
        });

        const orderIndex = this.userOrders.findIndex((order) => order.id === orderId);
        if (orderIndex !== -1) {
          this.userOrders[orderIndex] = response;
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
      this.users = [];
      this.selectedUser = null;
      this.userOrders = [];
      this.error = null;
    },
  },
});
