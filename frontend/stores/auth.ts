// store/auth.ts
import type { ActionTree, MutationTree } from 'vuex';
import type { AuthState, User, LoginCredentials, LoginResponse } from '~/types/auth';

export const state = (): AuthState => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
});

export const mutations: MutationTree<AuthState> = {
  SET_USER(state: AuthState, user: User | null) {
    state.user = user;
  },
  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token;
  },
  SET_AUTH_STATUS(state: AuthState, status: boolean) {
    state.isAuthenticated = status;
  },
  SET_LOADING(state: AuthState, status: boolean) {
    state.loading = status;
  },
};

export const actions: ActionTree<AuthState, any> = {
  async login({ commit }, credentials: LoginCredentials) {
    const { fetchApi } = useApi();
    commit('SET_LOADING', true);
    try {
      const response: LoginResponse = await fetchApi('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
      commit('SET_TOKEN', response.token);
      commit('SET_USER', response.user);
      commit('SET_AUTH_STATUS', true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

export const getters = {
  isAdmin: (state: AuthState): boolean => state.user?.role === 'admin',
  getUser: (state: AuthState): User | null => state.user,
  isAuthenticated: (state: AuthState): boolean => state.isAuthenticated,
  isLoading: (state: AuthState): boolean => state.loading,
};
