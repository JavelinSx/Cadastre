// utils/docs.ts
export enum DocumentTypeEnum {
  PASSPORT = 'passport',
  SNILS = 'snils',
  CONTACT = 'contact',
  PERSONAL_DATA = 'personal_data',
  OWNERSHIP_DOCUMENT = 'ownership_document',
  BOUNDARY_AGREEMENT = 'boundary_agreement',
  CONSTRUCTION_PERMIT = 'construction_permit',
  FLOOR_PLAN = 'floor_plan',
  DEMOLITION_PERMIT = 'demolition_permit',
  TERRITORY_PLAN = 'territory_plan',
}

export const documentTypeNames: Record<string, string> = {
  passport: 'Паспорт',
  snils: 'СНИЛС',
  contact: 'Контактные данные',
  personal_data: 'Согласие на обработку ПД',
  ownership_document: 'Документ о праве собственности',
  boundary_agreement: 'Согласование границ',
  construction_permit: 'Разрешение на строительство',
  floor_plan: 'План этажа',
  demolition_permit: 'Разрешение на снос',
  territory_plan: 'План территории',
};

export const documentNames: Record<DocumentTypeEnum, string> = {
  [DocumentTypeEnum.PASSPORT]: 'Паспорт',
  [DocumentTypeEnum.SNILS]: 'СНИЛС',
  [DocumentTypeEnum.CONTACT]: 'Контактные данные',
  [DocumentTypeEnum.PERSONAL_DATA]: 'Согласие на обработку ПД',
  [DocumentTypeEnum.OWNERSHIP_DOCUMENT]: 'Документ о праве собственности',
  [DocumentTypeEnum.BOUNDARY_AGREEMENT]: 'Согласование границ',
  [DocumentTypeEnum.CONSTRUCTION_PERMIT]: 'Разрешение на строительство',
  [DocumentTypeEnum.FLOOR_PLAN]: 'План этажа',
  [DocumentTypeEnum.DEMOLITION_PERMIT]: 'Разрешение на снос',
  [DocumentTypeEnum.TERRITORY_PLAN]: 'План территории',
};
