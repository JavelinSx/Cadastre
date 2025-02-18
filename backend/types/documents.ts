// types/documents.ts

// Статус документа
export enum DocumentStatus {
  PENDING = 'pending', // Ожидает проверки
  VERIFIED = 'verified', // Проверен и подтвержден
  REJECTED = 'rejected', // Отклонен
}

// Общие документы для всех услуг
export enum CommonDocumentType {
  PASSPORT = 'passport', // Паспорт
  SNILS = 'snils', // СНИЛС
  CONTACT = 'contact', // Контактные данные (телефон/почта)
  PERSONAL_DATA = 'personal_data', // Согласие на обработку персональных данных
}

// Интерфейс для документа в чеклисте
export interface DocumentCheckItem {
  type: string; // Тип документа (из CommonDocumentType или специфичный для услуги)
  status: DocumentStatus; // Статус документа
  verifiedAt?: Date; // Дата проверки
  verifiedBy?: string; // ID администратора, проверившего документ
  comment?: string; // Комментарий от администратора
  isRequired: boolean; // Обязательный ли документ
  updatedAt: Date; // Дата последнего обновления
}

// Интерфейс для чеклиста документов пользователя
export interface UserDocumentChecklist {
  serviceId: string; // ID услуги
  documents: DocumentCheckItem[]; // Список документов для проверки
  lastUpdated: Date; // Дата последнего обновления чеклиста
  status: DocumentStatus; // Общий статус проверки документов
}
