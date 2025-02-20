// types/documents.ts
export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum CommonDocumentType {
  PASSPORT = 'passport',
  SNILS = 'snils',
  CONTACT = 'contact',
  PERSONAL_DATA = 'personal_data',
}

export interface DocumentCheckItem {
  type: string;
  status: DocumentStatus;
  isRequired: boolean;
  comment?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  updatedAt: Date;
}

export interface DocumentUpdate {
  status: DocumentStatus;
  comment?: string;
  verifiedBy?: string;
}

// Специфические типы документов для разных услуг
export enum LandSurveyDocumentType {
  OWNERSHIP_DOCUMENT = 'ownership_document',
  BOUNDARY_AGREEMENT = 'boundary_agreement',
}

export enum BuildingPlanDocumentType {
  OWNERSHIP_DOCUMENT = 'ownership_document',
  CONSTRUCTION_PERMIT = 'construction_permit',
}

export enum RoomPlanDocumentType {
  OWNERSHIP_DOCUMENT = 'ownership_document',
  FLOOR_PLAN = 'floor_plan',
}

export enum InspectionActDocumentType {
  DEMOLITION_PERMIT = 'demolition_permit',
}

export enum LandLayoutDocumentType {
  TERRITORY_PLAN = 'territory_plan',
}

// Объединяем все типы документов для упрощения проверок
export type DocumentType =
  | CommonDocumentType
  | LandSurveyDocumentType
  | BuildingPlanDocumentType
  | RoomPlanDocumentType
  | InspectionActDocumentType
  | LandLayoutDocumentType;
