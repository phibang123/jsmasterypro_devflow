import { model, models, Schema, SchemaOptions } from 'mongoose';

import { schemaOptions } from './schema.options';

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, immutable: true },
    bio: { type: String },
    image: {
      type: String,
      default:
        'https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-6.jpg',
    },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  schemaOptions as SchemaOptions<IUser>,
);

const User = models?.User || model<IUser>('User', UserSchema);

export default User;
