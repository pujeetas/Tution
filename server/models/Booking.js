import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
export const PAYMENT_STATUSES = ['unpaid', 'paid'];

const bookingSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Denormalized from the tutor's TutorProfile at creation time; null if tutor is independent
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    date: {
      type: Date,
      required: [true, 'Session date/time is required'],
    },
    durationHours: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0.5, 'Minimum duration is 0.5 hours'],
      max: [8, 'Maximum duration is 8 hours'],
    },
    mode: {
      type: String,
      enum: ['online', 'in-person'],
      required: [true, 'Session mode is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'Pending',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ tutor: 1, date: 1 });
bookingSchema.index({ parent: 1, date: 1 });
bookingSchema.index({ organization: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
