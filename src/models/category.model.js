import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Category = model('Category', categorySchema);
export default Category;
