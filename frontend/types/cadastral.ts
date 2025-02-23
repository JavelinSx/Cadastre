// types/cadastral.ts
import type { DocumentStatus, DocumentCheckItem } from './documents';

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

export enum CadastralServiceType {
  LAND_SURVEY = 'land_survey',
  BUILDING_PLAN = 'building_plan',
  ROOM_PLAN = 'room_plan',
  INSPECTION_ACT = 'inspection_act',
  LAND_LAYOUT = 'land_layout',
}

export interface CadastralService {
  id: string;
  userId: string;
  type: CadastralServiceType;
  status: ServiceStatus;
  payment: boolean;
  price?: number;
  comment?: string;
  documents: DocumentCheckItem[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateServiceRequest {
  type: CadastralServiceType;
  price?: number;
  comment?: string;
}

export interface AddDocumentDto {
  type: string;
  isRequired?: boolean;
  comment?: string;
  status: DocumentStatus;
}

export interface UpdateServiceStatusRequest {
  status: ServiceStatus;
  comment?: string;
}

export interface ServiceUpdateResponse extends CadastralService {
  statusHistory: {
    status: ServiceStatus;
    date: Date;
    adminId: string;
    comment?: string;
  }[];
}
