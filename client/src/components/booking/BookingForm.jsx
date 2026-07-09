import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import useStudents from '../../hooks/useStudents.js';
import BusyCalendar from './BusyCalendar.jsx';
import { createBooking, getErrorMessage } from '../../services/api.js';
import { DURATIONS } from '../../utils/constants.js';
import { minDateTimeLocal } from '../../utils/formatDate.js';

const BookingForm = ({ tutor }) => {
  const navigate = useNavigate();
  const { students, loading: studentsLoading } = useStudents();

  const modeOptions =
    tutor.teachingMode === 'both' ? ['online', 'in-person'] : [tutor.teachingMode];

  const [form, setForm] = useState({
    subject: tutor.subjects[0] || '',
    date: '',
    durationHours: 1,
    mode: modeOptions[0],
    studentId: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!form.studentId && students.length > 0) {
      setForm((prev) => ({ ...prev, studentId: students[0]._id }));
    }
  }, [students]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.date) return setError('Please choose a date and time');
    if (new Date(form.date) <= new Date())
      return setError('Session must be in the future');
    if (!form.studentId) return setError('Please select a student');

    setSubmitting(true);
    try {
      await createBooking({
        tutorProfileId: tutor._id,
        subject: form.subject,
        date: new Date(form.date).toISOString(),
        durationHours: Number(form.durationHours),
        mode: form.mode,
        studentId: form.studentId,
        notes: form.notes.trim(),
      });
      navigate('/dashboard/parent', {
        state: { message: 'Booking request sent! The tutor will confirm shortly.' },
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (!studentsLoading && students.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        You need to add a student before requesting a booking.{' '}
        <Link
          to="/dashboard/parent"
          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          Add a student
        </Link>{' '}
        first.
      </p>
    );
  }

  const estimatedCost = (tutor.hourlyRate * Number(form.durationHours)).toFixed(0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      <BusyCalendar tutorId={tutor._id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input as="select" label="Subject" name="subject" value={form.subject} onChange={handleChange}>
          {tutor.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Input>
        <Input as="select" label="Session mode" name="mode" value={form.mode} onChange={handleChange}>
          {modeOptions.map((m) => (
            <option key={m} value={m}>
              {m === 'online' ? 'Online' : 'In-person'}
            </option>
          ))}
        </Input>
        <Input
          label="Date & time"
          name="date"
          type="datetime-local"
          min={minDateTimeLocal()}
          value={form.date}
          onChange={handleChange}
        />
        <Input
          as="select"
          label="Duration"
          name="durationHours"
          value={form.durationHours}
          onChange={handleChange}
        >
          {DURATIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </Input>
        <Input
          as="select"
          label="Student"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
        >
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.level})
            </option>
          ))}
        </Input>
      </div>

      <Input
        as="textarea"
        label="Notes for the tutor (optional)"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="e.g. Needs help with algebra and exam preparation"
        maxLength={500}
      />

      <div className="flex items-center justify-between rounded-lg bg-primary-50 px-4 py-3 dark:bg-primary-900/20">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Estimated cost
        </span>
        <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
          S${estimatedCost}
        </span>
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Sending request...' : 'Request Booking'}
      </Button>
    </form>
  );
};

export default BookingForm;
