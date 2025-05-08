import mongoose, { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  { timestamps: true }
);

export const Enrollment = model('Enrollment', enrollmentSchema);
export default Enrollment;
