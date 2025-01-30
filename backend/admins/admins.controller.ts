// admins/admins.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminAuthGuard } from 'guards/admin-auth.guard';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get('profile')
  @UseGuards(AdminAuthGuard)
  async getProfile(@Req() req) {
    return this.adminsService.findByName(req.user.name);
  }
}
