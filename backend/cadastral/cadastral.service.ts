// services/cadastral.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ServiceStatus, CadastralServiceType } from '../types/cadastral';
import { DocumentStatus } from '../types/documents';
import { CadastralService, CadastralServiceDocument } from './shemas/cadastral-service.schema';
import { CreateServiceDto, UpdateDocumentStatusDto, UpdateServiceStatusDto } from './dto';
import { AddDocumentDto } from './dto/cadastral.add-doc.dto';

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
  // Добавление нового документа к услуге
  async addServiceDocument(
    serviceId: string,
    addDocumentDto: AddDocumentDto,
    adminId: string
  ): Promise<CadastralServiceDocument> {
    const service = await this.cadastralServiceModel.findById(serviceId);

    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    // Проверка наличия документа с таким же типом
    const documentExists = service.documents.some((doc) => doc.type === addDocumentDto.type);
    if (documentExists) {
      throw new BadRequestException('Документ с таким названием уже существует');
    }

    // Добавляем новый документ в массив
    service.documents.push({
      type: addDocumentDto.type,
      status: addDocumentDto.status,
      isRequired: addDocumentDto.isRequired,
      comment: addDocumentDto.comment,
      verifiedAt: addDocumentDto.status === DocumentStatus.VERIFIED ? new Date() : undefined,
      verifiedBy: addDocumentDto.status === DocumentStatus.VERIFIED ? adminId : undefined,
      updatedAt: new Date(),
    });

    return service.save();
  }
  // Создание новой услуги
  async createService(userId: string, createServiceDto: CreateServiceDto) {
    // Больше не нужно обновлять документ пользователя
    const service = new this.cadastralServiceModel({
      userId,
      ...createServiceDto,
      documents: this.getRequiredDocuments(createServiceDto.type),
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
  // Обновление цены услуги
  async updateServicePrice(serviceId: string, price: number): Promise<CadastralService> {
    const service = await this.cadastralServiceModel.findById(serviceId);

    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    // Проверяем корректность цены
    if (price < 0) {
      throw new BadRequestException('Стоимость не может быть отрицательной');
    }

    service.price = price;
    return service.save();
  }

  // Валидация перехода между статусами
  private validateStatusTransition(currentStatus: ServiceStatus, newStatus: ServiceStatus) {
    if (currentStatus === newStatus) {
      throw new BadRequestException('Новый статус должен отличаться от текущего');
    }
    return true;
  }
}
