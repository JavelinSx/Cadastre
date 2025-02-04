import { defineStore } from 'pinia';

interface ThemeSwitcher {
  active: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeSwitcher => ({
    active: true,
  }),

  getters: {
    isActive: (state) => state.active,
  },

  actions: {
    switchTheme() {
      this.active = !this.active;
    },
  },

  persist: {
    paths: ['active'],
  },
});
