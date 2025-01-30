export const useDarkMode = () => {
  // Используем встроенный useState Nuxt с уникальным ключом
  const isDark = useState<boolean>('darkMode', () => false);

  // Функция для переключения темы
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (import.meta.client) {
      localStorage.setItem('darkMode', isDark.value.toString());
    }
  };

  // Инициализация темы
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      isDark.value = savedTheme === 'true';
    }
    watch(
      isDark,
      (newVal) => {
        document.documentElement.classList.toggle('dark', newVal);
      },
      { immediate: true }
    );
  }

  return {
    isDark,
    toggleTheme,
  };
};
