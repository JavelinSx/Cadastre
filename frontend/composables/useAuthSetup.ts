// composables/useAuthSetup.ts
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminAuthStore } from '~/stores/auth/auth.admin';
import { useUserAuthStore } from '~/stores/auth/auth.user';

export const useAuthSetup = () => {
  const adminAuthStore = useAdminAuthStore();
  const userAuthStore = useUserAuthStore();
  const router = useRouter();
  const route = useRoute();

  // Разделяем публичные маршруты на общие и административные
  const routeConfig = {
    public: {
      common: ['/', '/services', '/register'],
      admin: ['/login-admin'],
      user: ['/login'],
    },
    private: {
      admin: ['/admin'],
      user: ['/dashboard', '/orders', '/chat'],
    },
  };

  const isAdminRoute = (path: string): boolean => {
    return path.startsWith('/admin') || routeConfig.public.admin.includes(path);
  };

  const isPublicRoute = (path: string): boolean => {
    return (
      routeConfig.public.common.includes(path) ||
      routeConfig.public.admin.includes(path) ||
      routeConfig.public.user.includes(path)
    );
  };

  const initializeAuth = async () => {
    try {
      // Сначала пробуем инициализировать админа
      await adminAuthStore.initializeAuth();

      // Если админ не авторизован, пробуем инициализировать пользователя
      if (!adminAuthStore.isAuthenticated) {
        await userAuthStore.initializeAuth();
      }

      const isAuthenticated = adminAuthStore.isAuthenticated || userAuthStore.isAuthenticated;
      const currentPath = route.path;

      // Обработка неавторизованного доступа
      if (!isAuthenticated && !isPublicRoute(currentPath)) {
        // Если пытается попасть на админский маршрут
        if (isAdminRoute(currentPath)) {
          await router.push('/login-admin');
        } else {
          // Для пользовательских маршрутов
          await router.push('/login');
        }
        return;
      }

      // Обработка авторизованного доступа к публичным маршрутам
      if (isAuthenticated && isPublicRoute(currentPath)) {
        // Для админа
        if (adminAuthStore.isAuthenticated) {
          await router.push('/admin/orders');
          return;
        }
        // Для пользователя
        if (userAuthStore.isAuthenticated) {
          await router.push('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // В случае ошибки редиректим в зависимости от типа маршрута
      if (!isPublicRoute(route.path)) {
        if (isAdminRoute(route.path)) {
          await router.push('/login-admin');
        } else {
          await router.push('/login');
        }
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
