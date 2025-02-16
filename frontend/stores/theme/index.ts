// stores/theme.ts
import { defineStore } from 'pinia';
import { storage, STORAGE_KEYS } from '~/utils/storage';

interface ThemeState {
  isActive: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isActive: storage.get(STORAGE_KEYS.THEME) ?? false,
  }),

  actions: {
    switchTheme() {
      this.isActive = !this.isActive;
      storage.set(STORAGE_KEYS.THEME, this.isActive);
    },
  },
});
