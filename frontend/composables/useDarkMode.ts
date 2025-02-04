import { computed, onMounted } from 'vue';
import { useThemeStore } from '~/stores/theme';

export const useDarkMode = () => {
  const themeStore = useThemeStore();

  // Инициализация темы при монтировании
  onMounted(() => {
    if (import.meta.client) {
      // Применяем текущую тему на документ
      document.documentElement.classList.toggle('dark', themeStore.isActive);
    }
  });

  // Функция для переключения темы
  const toggleTheme = () => {
    themeStore.switchTheme();
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', themeStore.isActive);
    }
  };

  return {
    isDark: computed(() => themeStore.isActive),
    toggleTheme,
  };
};
