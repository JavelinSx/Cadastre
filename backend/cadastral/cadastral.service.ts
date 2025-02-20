// services/cadastral.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ServiceStatus, CadastralServiceType } from '../types/cadastral';
import { DocumentStatus } from '../types/documents';
import { CadastralService, CadastralServiceDocument } from './shemas/cadastral-service.schema';
import { CreateServiceDto, UpdateDocumentStatusDto, UpdateServiceStatusDto } from './dto';

@Injectable()
export class CadastralServiceService {
  constructor(
    @InjectModel(CadastralService.name)
    private cadastralServiceModel: Model<CadastralServiceDocument>
  ) {}

  // Получение списка услуг пользователя
  async getUserServices(userId: string) {
    return this.cadastralServiceModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findById(serviceId: string): Promise<CadastralServiceDocument | null> {
    return this.cadastralServiceModel.findById(serviceId).exec();
  }
  // Создание новой услуги
  async createService(userId: string, createServiceDto: CreateServiceDto) {
    // Получаем список необходимых документов для данного типа услуги
    const requiredDocuments = this.getRequiredDocuments(createServiceDto.type);

    const service = new this.cadastralServiceModel({
      userId,
      ...createServiceDto,
      documents: requiredDocuments,
      status: ServiceStatus.CONSULTATION,
    });

    return service.save();
  }

  // Обновление статуса услуги
  async updateServiceStatus(serviceId: string, updateStatusDto: UpdateServiceStatusDto, adminId: string) {
    const service = await this.cadastralServiceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    // Проверка возможности перехода в новый статус
    this.validateStatusTransition(service.status, updateStatusDto.status);

    // Если услуга завершена, устанавливаем дату завершения
    if (updateStatusDto.status === ServiceStatus.COMPLETED) {
      service.completedAt = new Date();
    }

    service.status = updateStatusDto.status;
    if (updateStatusDto.comment) {
      service.comment = updateStatusDto.comment;
    }

    return service.save();
  }

  // Обновление статуса документа
  async updateDocumentStatus(
    serviceId: string,
    documentType: string,
    updateDocumentDto: UpdateDocumentStatusDto,
    adminId: string
  ) {
    const service = await this.cadastralServiceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    const documentIndex = service.documents.findIndex((doc) => doc.type === documentType);
    if (documentIndex === -1) {
      throw new NotFoundException('Документ не найден');
    }

    service.documents[documentIndex] = {
      ...service.documents[documentIndex],
      status: updateDocumentDto.status,
      comment: updateDocumentDto.comment,
      verifiedAt: new Date(),
      verifiedBy: adminId,
      updatedAt: new Date(),
    };

    return service.save();
  }

  // Установка статуса оплаты
  async updatePaymentStatus(serviceId: string, paid: boolean) {
    const service = await this.cadastralServiceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    if (paid && service.status !== ServiceStatus.READY_FOR_PAYMENT) {
      throw new BadRequestException('Услуга не готова к оплате');
    }

    service.payment = paid;
    if (paid) {
      service.status = ServiceStatus.COMPLETED;
      service.completedAt = new Date();
    }

    return service.save();
  }

  // Получение списка необходимых документов для типа услуги
  private getRequiredDocuments(serviceType: CadastralServiceType) {
    // Общие документы для всех услуг
    const commonDocuments = [
      { type: 'passport', isRequired: true },
      { type: 'snils', isRequired: true },
      { type: 'personal_data', isRequired: true },
    ];

    // Специфические документы для каждого типа услуги
    const specificDocuments = {
      [CadastralServiceType.LAND_SURVEY]: [
        { type: 'ownership_document', isRequired: true },
        { type: 'boundary_agreement', isRequired: true },
      ],
      [CadastralServiceType.BUILDING_PLAN]: [
        { type: 'ownership_document', isRequired: true },
        { type: 'construction_permit', isRequired: true },
      ],
      [CadastralServiceType.ROOM_PLAN]: [
        { type: 'ownership_document', isRequired: true },
        { type: 'floor_plan', isRequired: true },
      ],
      [CadastralServiceType.INSPECTION_ACT]: [{ type: 'demolition_permit', isRequired: true }],
      [CadastralServiceType.LAND_LAYOUT]: [{ type: 'territory_plan', isRequired: true }],
    };

    // Объединяем общие и специфические документы
    return [...commonDocuments, ...(specificDocuments[serviceType] || [])].map((doc) => ({
      ...doc,
      status: DocumentStatus.PENDING,
      updatedAt: new Date(),
    }));
  }

  // Валидация перехода между статусами
  private validateStatusTransition(currentStatus: ServiceStatus, newStatus: ServiceStatus) {
    const validTransitions = {
      [ServiceStatus.CONSULTATION]: [ServiceStatus.DOCUMENTS_COLLECTION],
      [ServiceStatus.DOCUMENTS_COLLECTION]: [ServiceStatus.OBJECT_SURVEY, ServiceStatus.REJECTED],
      [ServiceStatus.OBJECT_SURVEY]: [ServiceStatus.DRAWING_PREPARATION, ServiceStatus.REJECTED],
      [ServiceStatus.DRAWING_PREPARATION]: [ServiceStatus.PACKAGE_PREPARATION, ServiceStatus.REJECTED],
      [ServiceStatus.PACKAGE_PREPARATION]: [ServiceStatus.AWAITING_RESPONSE, ServiceStatus.REJECTED],
      [ServiceStatus.AWAITING_RESPONSE]: [ServiceStatus.READY_FOR_PAYMENT, ServiceStatus.REJECTED],
      [ServiceStatus.REJECTED]: [
        ServiceStatus.DOCUMENTS_COLLECTION,
        ServiceStatus.OBJECT_SURVEY,
        ServiceStatus.DRAWING_PREPARATION,
      ],
      [ServiceStatus.READY_FOR_PAYMENT]: [ServiceStatus.COMPLETED],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Недопустимый переход из статуса ${currentStatus} в статус ${newStatus}`);
    }
  }
}
