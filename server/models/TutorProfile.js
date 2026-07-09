import mongoose from 'mongoose';

export const SUBJECTS = [
  'Math',
  'English',
  'Science',
  'Chinese',
  'Malay',
  'Tamil',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Geography',
];

export const LEVELS = ['PSLE', 'O-Levels', 'A-Levels'];

export const TEACHING_MODES = ['online', 'in-person', 'both'];

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Set when this tutor is staff of a tuition centre; null for independent tutors
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    subjects: {
      type: [{ type: String, enum: SUBJECTS }],
      validate: [(arr) => arr.length > 0, 'At least one subject is required'],
    },
    levels: {
      type: [{ type: String, enum: LEVELS }],
      validate: [(arr) => arr.length > 0, 'At least one level is required'],
    },
    teachingMode: {
      type: String,
      enum: TEACHING_MODES,
      required: [true, 'Teaching mode is required'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [1, 'Hourly rate must be at least 1 SGD'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    yearsExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      default: 0,
    },
  },
  { timestamps: true }
);

const TutorProfile = mongoose.model('TutorProfile', tutorProfileSchema);
export default TutorProfile;
