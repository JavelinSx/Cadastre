// controllers/cadastral.controller.ts
import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';

import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { CadastralServiceService } from './cadastral.service';
import { CreateServiceDto, UpdateDocumentStatusDto, UpdateServiceStatusDto } from './dto';

@Controller('cadastral')
export class CadastralController {
  constructor(private readonly cadastralService: CadastralServiceService) {}

  // Получение всех услуг пользователя
  @Get('users/:userId/services')
  @UseGuards(AdminAuthGuard)
  async getUserServices(@Param('userId') userId: string) {
    return this.cadastralService.getUserServices(userId);
  }

  // Создание новой услуги для пользователя (только админ)
  @Post('users/:userId/services')
  @UseGuards(AdminAuthGuard)
  async createService(@Param('userId') userId: string, @Body() createServiceDto: CreateServiceDto) {
    return this.cadastralService.createService(userId, createServiceDto);
  }

  // Обновление статуса услуги (только админ)
  @Patch('services/:serviceId/status')
  @UseGuards(AdminAuthGuard)
  async updateServiceStatus(
    @Param('serviceId') serviceId: string,
    @Body() updateStatusDto: UpdateServiceStatusDto,
    @Req() req
  ) {
    return this.cadastralService.updateServiceStatus(serviceId, updateStatusDto, req.user.id);
  }

  // Обновление статуса документа (только админ)
  @Patch('services/:serviceId/documents/:documentType')
  @UseGuards(AdminAuthGuard)
  async updateDocumentStatus(
    @Param('serviceId') serviceId: string,
    @Param('documentType') documentType: string,
    @Body() updateDocumentDto: UpdateDocumentStatusDto,
    @Req() req
  ) {
    return this.cadastralService.updateDocumentStatus(serviceId, documentType, updateDocumentDto, req.user.id);
  }

  // Обновление статуса оплаты (только админ)
  @Patch('services/:serviceId/payment')
  @UseGuards(AdminAuthGuard)
  async updatePaymentStatus(@Param('serviceId') serviceId: string, @Body('paid') paid: boolean) {
    return this.cadastralService.updatePaymentStatus(serviceId, paid);
  }

  // Получение своих услуг (для пользователя)
  @Get('my-services')
  @UseGuards(UserAuthGuard)
  async getMyServices(@Req() req) {
    return this.cadastralService.getUserServices(req.user.id);
  }

  // Получение конкретной услуги по ID
  @Get('services/:serviceId')
  @UseGuards(AdminAuthGuard)
  async getServiceById(@Param('serviceId') serviceId: string) {
    const service = await this.cadastralService.findById(serviceId);
    if (!service) {
      throw new BadRequestException('Услуга не найдена');
    }
    return service;
  }
}
