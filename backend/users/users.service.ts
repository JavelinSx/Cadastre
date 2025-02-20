// users/users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, SortOrder } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { DocumentStatus, DocumentCheckItem, UserDocumentChecklist } from '../types/documents';
import * as bcrypt from 'bcrypt';
import { ServiceStatus } from 'types/cadastral';
import { CreateServiceDto, UpdateServiceStatusDto } from 'cadastral/dto';

@Injectable()
export class UsersService {
  cadastralServiceModel: any;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(
    filter: FilterQuery<UserDocument> = {},
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit;
    const sortOptions: { [key: string]: SortOrder } = { [sortBy]: sortOrder };

    const [users, total] = await Promise.all([
      this.userModel.find(filter).sort(sortOptions).skip(skip).limit(limit).select('-password').exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async create(userData: { email?: string; phone?: string; password: string; fullName?: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return user.save();
  }

  async getUserServices(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'services',
        model: 'CadastralService',
        options: { sort: { createdAt: -1 } },
      })
      .exec();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.services;
  }

  // Получение конкретной услуги пользователя
  async getUserService(userId: string, serviceId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'services',
        match: { _id: serviceId },
        model: 'CadastralService',
      })
      .exec();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const service = user.services.find((service) => service.id === serviceId);
    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    return service;
  }

  // Добавление новой услуги пользователю
  async addUserService(userId: string, createServiceDto: CreateServiceDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Создаем новую услугу
    const newService = new this.cadastralServiceModel({
      userId,
      ...createServiceDto,
      status: ServiceStatus.CONSULTATION,
    });

    const savedService = await newService.save();

    // Добавляем ссылку на услугу в документ пользователя
    await this.userModel.findByIdAndUpdate(userId, { $push: { services: savedService._id } });

    return savedService;
  }

  // Обновление статуса услуги
  async updateServiceStatus(userId: string, serviceId: string, updateStatusDto: UpdateServiceStatusDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем, что услуга принадлежит пользователю
    const serviceExists = user.services.some((service) => service.id === serviceId);
    if (!serviceExists) {
      throw new BadRequestException('Услуга не принадлежит данному пользователю');
    }

    // Обновляем статус услуги
    const updatedService = await this.cadastralServiceModel.findByIdAndUpdate(
      serviceId,
      {
        $set: {
          status: updateStatusDto.status,
          ...(updateStatusDto.comment && { comment: updateStatusDto.comment }),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedService) {
      throw new NotFoundException('Услуга не найдена');
    }

    return updatedService;
  }

  // Получение статистики по услугам пользователя
  async getUserServicesStats(userId: string) {
    const services = await this.cadastralServiceModel.find({ userId }).exec();

    return {
      total: services.length,
      byStatus: {
        [ServiceStatus.CONSULTATION]: services.filter((s) => s.status === ServiceStatus.CONSULTATION).length,
        [ServiceStatus.DOCUMENTS_COLLECTION]: services.filter((s) => s.status === ServiceStatus.DOCUMENTS_COLLECTION)
          .length,
        [ServiceStatus.OBJECT_SURVEY]: services.filter((s) => s.status === ServiceStatus.OBJECT_SURVEY).length,
        [ServiceStatus.DRAWING_PREPARATION]: services.filter((s) => s.status === ServiceStatus.DRAWING_PREPARATION)
          .length,
        [ServiceStatus.PACKAGE_PREPARATION]: services.filter((s) => s.status === ServiceStatus.PACKAGE_PREPARATION)
          .length,
        [ServiceStatus.AWAITING_RESPONSE]: services.filter((s) => s.status === ServiceStatus.AWAITING_RESPONSE).length,
        [ServiceStatus.REJECTED]: services.filter((s) => s.status === ServiceStatus.REJECTED).length,
        [ServiceStatus.COMPLETED]: services.filter((s) => s.status === ServiceStatus.COMPLETED).length,
        [ServiceStatus.READY_FOR_PAYMENT]: services.filter((s) => s.status === ServiceStatus.READY_FOR_PAYMENT).length,
      },
      unpaid: services.filter((s) => !s.payment && s.status === ServiceStatus.READY_FOR_PAYMENT).length,
    };
  }

  // Удаление услуги (только для администраторов)
  async removeUserService(userId: string, serviceId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Удаляем ссылку на услугу из документа пользователя
    await this.userModel.findByIdAndUpdate(userId, { $pull: { services: serviceId } });

    // Удаляем саму услугу
    await this.cadastralServiceModel.findByIdAndDelete(serviceId);

    return { message: 'Услуга успешно удалена' };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    console.log('Service: поиск пользователя с ID:', id);

    try {
      const user = await this.userModel
        .findById(id)
        .populate({
          path: 'services',
          options: { sort: { createdAt: -1 } },
        })
        .populate('documentChecklists.documents')
        .exec();

      console.log('Service: пользователь найден:', user ? 'да' : 'нет');
      return user;
    } catch (error) {
      console.error('Service: ошибка поиска пользователя:', error);
      throw error;
    }
  }

  async findByPhone(phone: string) {
    return this.userModel.findOne({ phone }).exec();
  }
}
