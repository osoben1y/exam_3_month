import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin', 'author'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = model('User', userSchema);
export default User;
