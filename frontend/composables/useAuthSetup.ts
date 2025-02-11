// useAuthSetup.ts
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminAuthStore } from '~/stores/auth/auth.admin';
import { useUserAuthStore } from '~/stores/auth/auth.user';

export const useAuthSetup = () => {
  const adminAuthStore = useAdminAuthStore();
  const userAuthStore = useUserAuthStore();
  const router = useRouter();
  const route = useRoute();

  const publicRoutes = ['/login', '/register', '/', '/services', '/login-admin'];

  const initializeAuth = async () => {
    try {
      // Проверяем оба типа авторизации
      await Promise.all([adminAuthStore.initializeAuth(), userAuthStore.initializeAuth()]);

      const isAuthenticated = adminAuthStore.isAuthenticated || userAuthStore.isAuthenticated;

      if (!isAuthenticated && !publicRoutes.includes(route.path)) {
        router.push('/login');
      }
    } catch (error) {
      if (!publicRoutes.includes(route.path)) {
        router.push('/login');
      }
    }
  };

  onMounted(async () => {
    await initializeAuth();
  });

  return {
    initializeAuth,
  };
};
