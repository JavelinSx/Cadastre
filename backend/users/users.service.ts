// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, SortOrder } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { DocumentStatus, DocumentCheckItem, UserDocumentChecklist } from '../types/documents';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
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

  async initializeDocumentChecklist(userId: string, serviceId: string, requiredDocuments: string[]) {
    const checklist: UserDocumentChecklist = {
      serviceId,
      documents: requiredDocuments.map((type) => ({
        type,
        status: DocumentStatus.PENDING,
        isRequired: true,
        updatedAt: new Date(),
      })),
      lastUpdated: new Date(),
      status: DocumentStatus.PENDING,
    };

    return this.userModel.findByIdAndUpdate(userId, { $push: { documentChecklists: checklist } }, { new: true });
  }

  async updateDocumentStatus(
    userId: string,
    serviceId: string,
    documentType: string,
    status: DocumentStatus,
    adminId: string,
    comment?: string
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const checklistIndex = user.documentChecklists.findIndex((cl) => cl.serviceId.toString() === serviceId);

    if (checklistIndex === -1) throw new NotFoundException('Чеклист не найден');

    const documentIndex = user.documentChecklists[checklistIndex].documents.findIndex(
      (doc) => doc.type === documentType
    );

    if (documentIndex === -1) throw new NotFoundException('Документ не найден');

    const updateQuery = {
      [`documentChecklists.${checklistIndex}.documents.${documentIndex}.status`]: status,
      [`documentChecklists.${checklistIndex}.documents.${documentIndex}.verifiedAt`]: new Date(),
      [`documentChecklists.${checklistIndex}.documents.${documentIndex}.verifiedBy`]: adminId,
      [`documentChecklists.${checklistIndex}.documents.${documentIndex}.comment`]: comment,
      [`documentChecklists.${checklistIndex}.documents.${documentIndex}.updatedAt`]: new Date(),
      [`documentChecklists.${checklistIndex}.lastUpdated`]: new Date(),
    };

    return this.userModel.findByIdAndUpdate(userId, { $set: updateQuery }, { new: true });
  }

  async addInteraction(
    userId: string,
    interaction: {
      type: 'call' | 'chat' | 'office';
      description: string;
      adminId: string;
    }
  ) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          interactions: {
            ...interaction,
            date: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async toggleBlockUser(userId: string, isBlocked: boolean, reason?: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        isBlocked,
        blockReason: isBlocked ? reason : undefined,
        lastVisit: new Date(),
      },
      { new: true }
    );
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByPhone(phone: string) {
    return this.userModel.findOne({ phone }).exec();
  }
}
