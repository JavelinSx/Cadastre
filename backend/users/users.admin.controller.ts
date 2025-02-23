// src/users/users.admin.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  Get,
  Query,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { CadastralServiceService } from 'cadastral/cadastral.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin/users')
@UseGuards(AdminAuthGuard)
export class UsersAdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cadastralService: CadastralServiceService
  ) {}
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      // Проверяем существование пользователя
      const existingUser = await this.usersService.findById(id);
      if (!existingUser) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Если меняется email или телефон, проверяем их уникальность
      if (updateUserDto.email) {
        const userWithEmail = await this.usersService.findByEmail(updateUserDto.email);
        if (userWithEmail && userWithEmail.id !== id) {
          throw new ConflictException('Пользователь с таким email уже существует');
        }
      }

      if (updateUserDto.phone) {
        const userWithPhone = await this.usersService.findByPhone(updateUserDto.phone);
        if (userWithPhone && userWithPhone.id !== id) {
          throw new ConflictException('Пользователь с таким телефоном уже существует');
        }
      }

      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      return user;
    } catch (error) {
      // Логируем ошибку для отладки
      console.error('Error updating user:', error);

      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message || 'Ошибка при обновлении пользователя');
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      const services = await this.cadastralService.getUserServices(id);

      return {
        ...user.toJSON(),
        services,
      };
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении данных пользователя');
    }
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      // Проверяем существование пользователя
      if (createUserDto.email) {
        const existingUserByEmail = await this.usersService.findByEmail(createUserDto.email);
        if (existingUserByEmail) {
          throw new ConflictException('Пользователь с таким email уже существует');
        }
      }

      if (createUserDto.phone) {
        const existingUserByPhone = await this.usersService.findByPhone(createUserDto.phone);
        if (existingUserByPhone) {
          throw new ConflictException('Пользователь с таким телефоном уже существует');
        }
      }

      // Валидация данных
      if (!createUserDto.email && !createUserDto.phone) {
        throw new BadRequestException('Необходимо указать email или телефон');
      }

      // Создаем пользователя
      const user = await this.usersService.create(createUserDto);

      // Преобразуем документ в JSON и возвращаем
      if (user) {
        return (user as UserDocument).toJSON();
      }

      throw new InternalServerErrorException('Ошибка при создании пользователя');
    } catch (error) {
      // Если ошибка уже является HTTP исключением, пробрасываем её
      if (error.status) {
        throw error;
      }

      // Логируем неожиданные ошибки
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Произошла ошибка при создании пользователя');
    }
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('isBlocked') isBlocked?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    try {
      // Формируем фильтр
      const filter: FilterQuery<UserDocument> = {};

      if (search) {
        filter.$or = [
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
          { fullName: new RegExp(search, 'i') },
        ];
      }

      if (isBlocked !== undefined) {
        filter.isBlocked = isBlocked;
      }

      const result = await this.usersService.findAll(filter, page, limit, sortBy, sortOrder);

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при получении списка пользователей');
    }
  }
}
