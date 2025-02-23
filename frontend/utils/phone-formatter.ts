export const formatPhoneForDB = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length !== 11) return phone;

  // Если начинается с 8, заменяем на +7
  if (cleaned.startsWith('8')) {
    return '+7' + cleaned.slice(1);
  }
  // Если начинается с 7, добавляем +
  if (cleaned.startsWith('7')) {
    return '+' + cleaned;
  }
  // В других случаях возвращаем как есть
  return cleaned;
};

export const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length !== 11) return phone;

  return `8 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  return cleaned.startsWith('8') || cleaned.startsWith('7');
};
