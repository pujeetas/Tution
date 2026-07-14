import mongoose from 'mongoose';

export const ATTENDANCE_STATUSES = ['Present', 'Late', 'Absent'];
export const ABSENCE_VALIDITY = ['Valid', 'Invalid'];

const recordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ATTENDANCE_STATUSES, default: 'Present' },
    // Only meaningful when status === 'Absent'; null otherwise.
    absenceValidity: { type: String, enum: ABSENCE_VALIDITY, default: null },
    remark: { type: String, trim: true, default: '', maxlength: 300 },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    // Plain "YYYY-MM-DD" rather than a Date — sidesteps timezone ambiguity
    // over which calendar day a session belongs to, and makes the
    // (class, date) uniqueness check exact-match instead of a range query.
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    records: [recordSchema],
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

attendanceSchema.index({ class: 1, date: 1 }, { unique: true });
attendanceSchema.index({ organization: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
