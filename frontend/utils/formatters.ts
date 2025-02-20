// utils/formatters.ts
export const formatDate = (date?: string | Date): string => {
  if (!date) return '—';
  return new Date(date).toLocaleString('ru-RU');
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(price);
};
