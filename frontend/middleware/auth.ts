import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAdminAuthStore } from '~/stores/auth/auth.admin';
import { useUserAuthStore } from '~/stores/auth/auth.user';

export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: ('admin' | 'user')[];
}

export default defineNuxtRouteMiddleware(async (to) => {
  const adminAuthStore = useAdminAuthStore();
  const userAuthStore = useUserAuthStore();

  // Публичные маршруты не требуют авторизации
  const publicRoutes = ['/login', '/login-admin', '/register', '/services', '/'];

  // Маршруты администратора
  const adminRoutes = ['/admin', '/admin/orders', '/admin/users', '/admin/chats'];

  // Маршруты пользователя
  const userRoutes = ['/dashboard', '/orders', '/chat'];

  const path = to.path;

  // Инициализация состояния аутентификации
  if (!adminAuthStore.initialized) {
    await adminAuthStore.initializeAuth();
  }
  if (!userAuthStore.initialized) {
    await userAuthStore.initializeAuth();
  }

  const isAdmin = adminAuthStore.isAuthenticated;
  const isUser = userAuthStore.isAuthenticated;

  try {
    // Особая обработка страниц входа
    if (path === '/login-admin') {
      if (isAdmin) return navigateTo('/admin/orders');
      return;
    }

    if (path === '/login') {
      if (isUser) return navigateTo('/dashboard');
      if (isAdmin) return navigateTo('/admin/orders');
      return;
    }

    // Обработка публичных маршрутов
    if (publicRoutes.includes(path)) {
      if (isAdmin) return navigateTo('/admin/orders');
      if (isUser) return navigateTo('/dashboard');
      return;
    }

    // Проверка доступа к маршрутам администратора
    if (path.startsWith('/admin')) {
      if (!isAdmin) return navigateTo('/login-admin');
      return;
    }

    // Проверка доступа к маршрутам пользователя
    if (userRoutes.some((route) => path.startsWith(route))) {
      if (!isUser) return navigateTo('/login');
      return;
    }

    // Для всех остальных маршрутов требуется базовая авторизация
    if (!isAdmin && !isUser) {
      return navigateTo('/login');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return navigateTo('/login');
  }
});
