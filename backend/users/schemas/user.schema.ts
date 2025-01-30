// users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// users/schemas/user.schema.ts
@Schema({ timestamps: true })
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

  @Prop({ default: 'client' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
