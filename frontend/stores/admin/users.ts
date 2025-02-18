// stores/admin/users.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { DocumentStatus } from '~/types/documents';
import type { User, UserResponse, UsersListResponse, UserFilter, CreateUserDto } from '~/types/users';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const useAdminUsersStore = defineStore('admin/users', {
  state: (): UsersState => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
    },
  }),

  getters: {
    getUserById: (state) => (id: string) => state.users.find((user) => user.id === id),

    getActiveUsers: (state) => state.users.filter((user) => !user.isBlocked),

    getBlockedUsers: (state) => state.users.filter((user) => user.isBlocked),
  },

  actions: {
    async fetchUsers(filter: UserFilter = {}) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<UsersListResponse>(`/api/admin/users`, {
          params: {
            search: filter.search,
            isBlocked: filter.isBlocked,
            sortBy: filter.sortBy || 'createdAt',
            sortOrder: filter.sortOrder || 'desc',
            page: filter.page || 1,
            limit: filter.limit || 10,
          },
        });
        this.users = response.users;
        this.pagination = response.pagination;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateDocumentStatus(
      userId: string,
      serviceId: string,
      documentType: string,
      status: DocumentStatus,
      comment?: string
    ) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<UserResponse>(`/api/admin/users/${userId}/documents/status`, {
          method: 'POST',
          body: {
            serviceId,
            documentType,
            status,
            comment,
          },
        });

        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = response;
        }
        if (this.selectedUser?.id === userId) {
          this.selectedUser = response;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: CreateUserDto) {
      const { fetchApi } = useApi();
      this.loading = true;
      this.error = null;

      try {
        const response = await fetchApi<UserResponse>('/api/admin/users', {
          method: 'POST',
          body: userData,
        });

        // Добавляем нового пользователя в список
        this.users.unshift(response);

        return response;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addInteraction(
      userId: string,
      interaction: {
        type: 'call' | 'chat' | 'office';
        description: string;
      }
    ) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<UserResponse>(`/api/admin/users/${userId}/interactions`, {
          method: 'POST',
          body: interaction,
        });

        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = response;
        }
        if (this.selectedUser?.id === userId) {
          this.selectedUser = response;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleBlockUser(userId: string, isBlocked: boolean, reason?: string) {
      const { fetchApi } = useApi();
      this.loading = true;
      try {
        const response = await fetchApi<UserResponse>(`/api/admin/users/${userId}/block`, {
          method: 'POST',
          body: { isBlocked, reason },
        });

        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = response;
        }
        if (this.selectedUser?.id === userId) {
          this.selectedUser = response;
        }
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
