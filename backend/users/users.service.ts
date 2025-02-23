// users/users.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, SortOrder } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ServiceStatus } from 'types/cadastral';
import { CreateServiceDto, UpdateServiceStatusDto } from 'cadastral/dto';
import { InjectModel as InjectModelCadastral } from '@nestjs/mongoose';
import { CadastralService, CadastralServiceDocument } from '../cadastral/shemas/cadastral-service.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModelCadastral(CadastralService.name) private cadastralServiceModel: Model<CadastralServiceDocument>
  ) {}

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

  // Теперь получаем услуги напрямую из коллекции услуг
  async getUserServices(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.cadastralServiceModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // Получение конкретной услуги пользователя
  async getUserService(userId: string, serviceId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const service = await this.cadastralServiceModel
      .findOne({
        _id: serviceId,
        userId: userId,
      })
      .exec();

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

    return newService.save();
  }

  // Обновление статуса услуги
  async updateServiceStatus(userId: string, serviceId: string, updateStatusDto: UpdateServiceStatusDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем, что услуга принадлежит пользователю
    const service = await this.cadastralServiceModel.findOne({
      _id: serviceId,
      userId: userId,
    });

    if (!service) {
      throw new BadRequestException('Услуга не найдена или не принадлежит данному пользователю');
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

    // Проверяем принадлежность услуги пользователю
    const service = await this.cadastralServiceModel.findOne({
      _id: serviceId,
      userId: userId,
    });

    if (!service) {
      throw new BadRequestException('Услуга не найдена или не принадлежит данному пользователю');
    }

    // Удаляем услугу
    await this.cadastralServiceModel.findByIdAndDelete(serviceId);

    return { message: 'Услуга успешно удалена' };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    console.log('Service: поиск пользователя с ID:', id);

    try {
      const user = await this.userModel.findById(id).exec();
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

  // Добавляем метод обновления пользователя
  async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
    try {
      const { phone, ...rest } = updateData;

      // Форматируем данные перед обновлением
      const formattedData = {
        ...rest,
        ...(phone && { phone: this.formatPhoneNumber(phone) }),
      };

      // Добавляем обработку ошибок при обновлении
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          { $set: formattedData },
          {
            new: true,
            runValidators: true, // Включаем валидацию при обновлении
          }
        )
        .exec();

      return updatedUser;
    } catch (error) {
      // Логируем ошибку
      console.error('Error in users.service.update:', error);

      // Проверяем тип ошибки и перебрасываем соответствующее исключение
      if (error.code === 11000) {
        // Ошибка уникальности
        throw new ConflictException('Пользователь с такими данными уже существует');
      }

      throw error;
    }
  }

  private formatPhoneNumber(phone: string): string {
    try {
      // Очищаем от всех не-цифр
      const cleaned = phone.replace(/\D/g, '');

      // Если номер начинается с 8, заменяем на 7
      if (cleaned.startsWith('8')) {
        return '7' + cleaned.slice(1);
      }

      // Если номер уже начинается с 7, оставляем как есть
      if (cleaned.startsWith('7')) {
        return cleaned;
      }

      // В других случаях добавляем 7 в начало
      return '7' + cleaned;
    } catch (error) {
      console.error('Error formatting phone number:', error);
      throw new BadRequestException('Неверный формат номера телефона');
    }
  }
}
