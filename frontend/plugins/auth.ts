import { useAuthStore } from '~/stores/auth';

// plugins/auth.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  // Initialize auth state on app start
  const authStore = useAuthStore();
  await authStore.initializeAuth();
});
