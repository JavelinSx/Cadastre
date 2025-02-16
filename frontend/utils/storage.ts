// utils/storage.ts
import type { Admin, User } from '~/types';

// Ключи для localStorage
export const STORAGE_KEYS = {
  ADMIN: 'admin_data',
  USER: 'user_data',
  THEME: 'theme',
} as const;

// Типы для хранимых данных
type StorageData = {
  [STORAGE_KEYS.ADMIN]: Admin | null;
  [STORAGE_KEYS.USER]: User | null;
  [STORAGE_KEYS.THEME]: boolean;
};

// Утилиты для работы с localStorage
export const storage = {
  get<K extends keyof StorageData>(key: K): StorageData[K] | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      console.log(`Reading from storage [${key}]:`, item); // Debug log
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage [${key}]:`, error);
      return null;
    }
  },

  set<K extends keyof StorageData>(key: K, value: StorageData[K]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Saved to storage [${key}]:`, value); // Debug log
    } catch (error) {
      console.error(`Error saving to storage [${key}]:`, error);
    }
  },

  remove(key: keyof StorageData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      console.log(`Removed from storage [${key}]`); // Debug log
    } catch (error) {
      console.error(`Error removing from storage [${key}]:`, error);
    }
  },
};
