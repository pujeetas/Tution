import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['tutor', 'parent', 'centre'],
      required: [true, 'Role is required'],
    },
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    // Set for centre-admin users (their own org) and for staff tutors employed by a centre
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    // Whether this tutor/centre admin has completed the post-signup "Getting Started" step
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    // Which registration forms this account has enabled (set during onboarding)
    registrationForms: {
      student: { type: Boolean, default: true },
      admin: { type: Boolean, default: false },
    },
    // Customised field configuration for the Student/Admin registration forms
    // (Form Builder). Free-form since the field catalog is defined client-side.
    formConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
