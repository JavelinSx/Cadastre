// types/route.ts
export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: ('admin' | 'user')[];
}

import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
// middleware/auth.ts
import { useAdminAuthStore } from '~/stores/auth/auth.admin';
import { useUserAuthStore } from '~/stores/auth/auth.user';

export default defineNuxtRouteMiddleware(async (to) => {
  const adminAuthStore = useAdminAuthStore();
  const userAuthStore = useUserAuthStore();

  // Конфигурация маршрутов
  const routeConfig: Record<string, RouteConfig> = {
    // Публичные маршруты
    '/': { path: '/', requiresAuth: false },
    '/login': { path: '/login', requiresAuth: false },
    '/login-admin': { path: '/login-admin', requiresAuth: false },
    '/register': { path: '/register', requiresAuth: false },
    '/services': { path: '/services', requiresAuth: false },

    // Маршруты админа
    '/admin/orders': {
      path: '/admin/orders',
      requiresAuth: true,
      allowedRoles: ['admin'],
    },
    '/admin/users': {
      path: '/admin/users',
      requiresAuth: true,
      allowedRoles: ['admin'],
    },
    '/admin/chats': {
      path: '/admin/chats',
      requiresAuth: true,
      allowedRoles: ['admin'],
    },

    // Маршруты пользователя
    '/dashboard': {
      path: '/dashboard',
      requiresAuth: true,
      allowedRoles: ['user'],
    },
    '/orders': {
      path: '/orders',
      requiresAuth: true,
      allowedRoles: ['user'],
    },
    '/chat': {
      path: '/chat',
      requiresAuth: true,
      allowedRoles: ['user'],
    },
  };

  /**
   * Функция проверки авторизации
   */
  const checkAuth = async () => {
    // Если не инициализированы - инициализируем
    if (!adminAuthStore.initialized) {
      await adminAuthStore.initializeAuth();
    }
    if (!userAuthStore.initialized) {
      await userAuthStore.initializeAuth();
    }

    return {
      isAdmin: adminAuthStore.isAuthenticated,
      isUser: userAuthStore.isAuthenticated,
    };
  };

  /**
   * Получаем конфигурацию текущего маршрута
   */
  const getCurrentRouteConfig = (path: string): RouteConfig | null => {
    // Сначала проверяем точное совпадение
    if (routeConfig[path]) {
      return routeConfig[path];
    }

    // Затем проверяем вложенные маршруты админа
    if (path.startsWith('/admin/')) {
      return {
        path,
        requiresAuth: true,
        allowedRoles: ['admin'],
      };
    }

    // Затем проверяем защищенные маршруты пользователя
    if (!Object.values(routeConfig).find((route) => route.path === path)) {
      return {
        path,
        requiresAuth: true,
        allowedRoles: ['user'],
      };
    }

    return null;
  };

  try {
    const { isAdmin, isUser } = await checkAuth();
    const currentRoute = getCurrentRouteConfig(to.path);

    // Если маршрут не найден - пропускаем
    if (!currentRoute) {
      return;
    }

    // Если маршрут не требует авторизации - пропускаем
    if (!currentRoute.requiresAuth) {
      // Если пользователь авторизован, редиректим на соответствующую dashboard
      if (isAdmin) {
        return navigateTo('/admin/orders');
      }
      if (isUser) {
        return navigateTo('/dashboard');
      }
      return;
    }

    // Проверяем права доступа
    if (currentRoute.allowedRoles) {
      const hasAccess =
        (currentRoute.allowedRoles.includes('admin') && isAdmin) ||
        (currentRoute.allowedRoles.includes('user') && isUser);

      if (!hasAccess) {
        // Редиректим на соответствующую страницу входа
        if (currentRoute.allowedRoles.includes('admin')) {
          return navigateTo('/login-admin');
        } else {
          return navigateTo('/login');
        }
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return navigateTo('/login');
  }
});
