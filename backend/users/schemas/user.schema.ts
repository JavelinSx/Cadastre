// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CommonDocumentType, DocumentStatus, UserDocumentChecklist } from 'types/documents';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({
    required: false,
    unique: true,
    sparse: true,
  })
  email?: string;

  @Prop({
    required: false,
    unique: true,
    sparse: true,
  })
  phone?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  fullName?: string;

  @Prop({
    type: [
      {
        serviceId: { type: MongooseSchema.Types.ObjectId, ref: 'Service' },
        documents: [
          {
            type: String,
            status: {
              type: String,
              enum: Object.values(DocumentStatus),
              default: DocumentStatus.PENDING,
            },
            verifiedAt: Date,
            verifiedBy: { type: MongooseSchema.Types.ObjectId, ref: 'Admin' },
            comment: String,
            isRequired: { type: Boolean, default: true },
            updatedAt: { type: Date, default: Date.now },
          },
        ],
        lastUpdated: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: Object.values(DocumentStatus),
          default: DocumentStatus.PENDING,
        },
      },
    ],
  })
  documentChecklists: UserDocumentChecklist[];

  @Prop({
    type: [
      {
        date: Date,
        type: {
          type: String,
          enum: ['call', 'chat', 'office'],
        },
        description: String,
        adminId: MongooseSchema.Types.ObjectId,
      },
    ],
  })
  interactions?: Array<{
    date: Date;
    type: 'call' | 'chat' | 'office';
    description: string;
    adminId: MongooseSchema.Types.ObjectId;
  }>;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop()
  blockReason?: string;

  @Prop({ default: Date.now })
  lastVisit: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('commonDocumentsStatus').get(function () {
  if (!this.documentChecklists.length) return DocumentStatus.PENDING;

  const commonDocs = Object.values(CommonDocumentType);
  const commonDocuments = this.documentChecklists.flatMap((checklist) =>
    checklist.documents.filter((doc) => commonDocs.includes(doc.type as CommonDocumentType))
  );

  if (!commonDocuments.length) return DocumentStatus.PENDING;

  if (commonDocuments.every((doc) => doc.status === DocumentStatus.VERIFIED)) {
    return DocumentStatus.VERIFIED;
  }

  if (commonDocuments.some((doc) => doc.status === DocumentStatus.REJECTED)) {
    return DocumentStatus.REJECTED;
  }

  return DocumentStatus.PENDING;
});

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ isBlocked: 1 });
UserSchema.index({ lastVisit: -1 });
UserSchema.index({ 'documentChecklists.serviceId': 1 });
UserSchema.index({ 'documentChecklists.status': 1 });

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export type UserDocument = User & Document;
