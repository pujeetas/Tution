import mongoose from 'mongoose';

export const STUDENT_LEVELS = ['Primary', 'Secondary', 'JC'];

const studentSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, "Student's name is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: STUDENT_LEVELS,
      required: [true, "Student's level is required"],
    },
    // Set when a tutor/centre admin adds the student on the parent's behalf
    // (rather than the parent adding their own child from their dashboard).
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
  },
  { timestamps: true }
);

studentSchema.index({ parent: 1 });
studentSchema.index({ addedBy: 1 });

const Student = mongoose.model('Student', studentSchema);
export default Student;
