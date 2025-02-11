// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
