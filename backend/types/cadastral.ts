// types/cadastral.ts

import { DocumentStatus } from './documents';

// Статусы услуги
export enum ServiceStatus {
  CONSULTATION = 'consultation',
  DOCUMENTS_COLLECTION = 'documents_collection',
  OBJECT_SURVEY = 'object_survey',
  DRAWING_PREPARATION = 'drawing_preparation',
  PACKAGE_PREPARATION = 'package_preparation',
  AWAITING_RESPONSE = 'awaiting_response',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  READY_FOR_PAYMENT = 'ready_for_payment',
}

// Типы кадастровых услуг
export enum CadastralServiceType {
  LAND_SURVEY = 'land_survey', // Межевание земельного участка
  BUILDING_PLAN = 'building_plan', // Технический план здания
  ROOM_PLAN = 'room_plan', // Технический план помещения
  INSPECTION_ACT = 'inspection_act', // Акт обследования
  LAND_LAYOUT = 'land_layout', // Схема расположения ЗУ
}

// Интерфейс кадастровой услуги
export interface CadastralService {
  id: string;
  userId: string;
  type: CadastralServiceType;
  status: ServiceStatus;
  payment: boolean;
  price?: number;
  comment?: string;
  documents: ServiceDocument[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Документ услуги
export interface ServiceDocument {
  type: string;
  status: DocumentStatus;
  isRequired: boolean;
  comment?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  updatedAt: Date;
}
