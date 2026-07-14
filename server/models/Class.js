import mongoose from 'mongoose';
import { STUDENT_LEVELS } from './Student.js';
import { SUBJECTS } from './TutorProfile.js';

export const CLASS_LEVELS = STUDENT_LEVELS;
export const CLASS_SUBJECTS = SUBJECTS;
export const CLASS_LESSON_TYPES = ['Group', 'One-to-One', 'Workshop']; // Figma names the field but never enumerates values
export const CLASS_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const CLASS_VISIBILITIES = ['Public', 'Private'];
export const CLASS_STATUSES = ['Active', 'Archived'];

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Class name is required'], trim: true },
    lessonType: { type: String, enum: CLASS_LESSON_TYPES, default: 'Group' },
    schedule: {
      dayOfWeek: { type: String, enum: CLASS_DAYS },
      startTime: { type: String, trim: true, default: '' }, // "18:00"
      endTime: { type: String, trim: true, default: '' }, // "20:00"
    },
    level: { type: String, enum: CLASS_LEVELS, required: [true, 'Level is required'] },
    subject: { type: String, enum: CLASS_SUBJECTS, required: [true, 'Subject is required'] },
    location: { type: String, trim: true, default: '' },
    tutors: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      validate: [(arr) => arr.length > 0, 'At least one tutor must be assigned'],
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    description: { type: String, trim: true, default: '' },
    visibility: { type: String, enum: CLASS_VISIBILITIES, default: 'Public' },
    status: { type: String, enum: CLASS_STATUSES, default: 'Active' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
  },
  { timestamps: true }
);

classSchema.index({ addedBy: 1 });
classSchema.index({ organization: 1 });

const Class = mongoose.model('Class', classSchema);
export default Class;
