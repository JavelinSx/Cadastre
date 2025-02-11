// admins/admins.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const createdAdmin = new this.adminModel({
      ...createAdminDto,
      password: hashedPassword,
    });
    return createdAdmin.save();
  }

  async findByLogin(login: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ login }).exec();
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return this.adminModel.findById(id).exec();
  }
}
