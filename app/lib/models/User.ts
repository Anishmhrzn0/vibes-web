import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  bio?: string;     
  avatar?: string; 
  role: 'user' | 'admin';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    password: { type: String, required: true },
    bio:      { type: String, default: '' },      
    avatar:   { type: String, default: '' }, 
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>('User', UserSchema);