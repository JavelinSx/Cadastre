// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export interface UserJSON {
  id: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

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

  toJSON(): UserJSON {
    return {
      id: this['_id'].toString(),
      email: this.email,
      phone: this.phone,
      role: this.role,
      createdAt: this['createdAt'],
      updatedAt: this['updatedAt'],
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
