// schemas/cadastral-service.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CadastralServiceType, ServiceStatus } from 'types/cadastral';
import { DocumentStatus } from 'types/documents';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class CadastralService {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    enum: Object.values(CadastralServiceType),
    required: true,
  })
  type: CadastralServiceType;

  @Prop({
    type: String,
    enum: Object.values(ServiceStatus),
    default: ServiceStatus.CONSULTATION,
  })
  status: ServiceStatus;

  @Prop({ default: false })
  payment: boolean;

  @Prop()
  price?: number;

  @Prop()
  comment?: string;

  @Prop({
    type: [
      {
        type: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: Object.values(DocumentStatus),
          default: DocumentStatus.PENDING,
        },
        isRequired: {
          type: Boolean,
          default: true,
        },
        comment: String,
        verifiedAt: Date,
        verifiedBy: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Admin',
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  })
  documents: Array<{
    type: string;
    status: DocumentStatus;
    isRequired: boolean;
    comment?: string;
    verifiedAt?: Date;
    verifiedBy?: string;
    updatedAt: Date;
  }>;

  @Prop()
  completedAt?: Date;
}

export type CadastralServiceDocument = CadastralService & Document;
export const CadastralServiceSchema = SchemaFactory.createForClass(CadastralService);

// Индексы для оптимизации запросов
CadastralServiceSchema.index({ userId: 1 });
CadastralServiceSchema.index({ status: 1 });
CadastralServiceSchema.index({ payment: 1 });
CadastralServiceSchema.index({ type: 1 });
CadastralServiceSchema.index({ createdAt: -1 });
