import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

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
    childName: {
      type: String,
      required: [true, "Child's name is required"],
      trim: true,
    },
    childLevel: {
      type: String,
      enum: ['Primary', 'Secondary', 'JC'],
      required: [true, "Child's level is required"],
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
  },
  { timestamps: true }
);

bookingSchema.index({ tutor: 1, date: 1 });
bookingSchema.index({ parent: 1, date: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
