// composables/useAuthSetup.ts
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter, useRoute } from 'vue-router';

export const useAuthSetup = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  // Список публичных маршрутов
  const publicRoutes = ['/login', '/register', '/', '/services', '/login-admin'];

  // Инициализация авторизации
  const initializeAuth = async () => {
    try {
      await authStore.initializeAuth();

      // Проверяем доступ к маршруту
      if (!authStore.isAuthenticated && !publicRoutes.includes(route.path)) {
        router.push('/login');
      }
    } catch (error) {
      // В случае ошибки, также редиректим на логин
      if (!publicRoutes.includes(route.path)) {
        router.push('/login');
      }
    }
  };

  // Инициализируем при монтировании
  onMounted(async () => {
    console.log('Auth setup mounted');
    await initializeAuth();
  });

  return {
    initializeAuth,
  };
};
