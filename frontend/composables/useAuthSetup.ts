import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '~/stores/auth/auth.admin';
import { useUserAuthStore } from '~/stores/auth/auth.user';

// composables/useAuthSetup.ts
export const useAuthSetup = () => {
  const adminAuthStore = useAdminAuthStore();
  const userAuthStore = useUserAuthStore();
  const router = useRouter();
  const route = useRoute();

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

  const isUserRoute = (path: string): boolean => {
    return routeConfig.private.user.some((route) => path.startsWith(route));
  };

  const isPublicRoute = (path: string): boolean => {
    return [...routeConfig.public.common, ...routeConfig.public.admin, ...routeConfig.public.user].includes(path);
  };

  const initializeAuth = async () => {
    try {
      const currentPath = route.path;

      // Пропускаем инициализацию для страниц логина
      if (currentPath === '/login-admin' || currentPath === '/login') {
        return;
      }

      // Сначала проверяем наличие админской авторизации
      await adminAuthStore.initializeAuth();

      // Если админ не авторизован, проверяем пользовательскую
      if (!adminAuthStore.isAuthenticated) {
        await userAuthStore.initializeAuth();
      }

      const isAuthenticated = adminAuthStore.isAuthenticated || userAuthStore.isAuthenticated;

      // Редиректы только для приватных маршрутов
      if (!isAuthenticated && !isPublicRoute(currentPath)) {
        if (isAdminRoute(currentPath)) {
          await router.push('/login-admin');
        } else {
          await router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  };

  onMounted(async () => {
    await initializeAuth();
  });

  return {
    initializeAuth,
    isAdminRoute,
    isUserRoute,
    isPublicRoute,
  };
};
