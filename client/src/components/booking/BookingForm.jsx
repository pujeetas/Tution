import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import useAuth from '../../hooks/useAuth.js';
import { createBooking, getErrorMessage } from '../../services/api.js';
import { CHILD_LEVELS, DURATIONS } from '../../utils/constants.js';
import { minDateTimeLocal } from '../../utils/formatDate.js';

const BookingForm = ({ tutor }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const modeOptions =
    tutor.teachingMode === 'both' ? ['online', 'in-person'] : [tutor.teachingMode];

  const [form, setForm] = useState({
    subject: tutor.subjects[0] || '',
    date: '',
    durationHours: 1,
    mode: modeOptions[0],
    childName: user?.childName || '',
    childLevel: user?.childLevel || 'Primary',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.date) return setError('Please choose a date and time');
    if (new Date(form.date) <= new Date())
      return setError('Session must be in the future');
    if (!form.childName.trim()) return setError("Please enter your child's name");

    setSubmitting(true);
    try {
      await createBooking({
        tutorProfileId: tutor._id,
        subject: form.subject,
        date: new Date(form.date).toISOString(),
        durationHours: Number(form.durationHours),
        mode: form.mode,
        childName: form.childName.trim(),
        childLevel: form.childLevel,
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

  const estimatedCost = (tutor.hourlyRate * Number(form.durationHours)).toFixed(0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

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
          label="Child's name"
          name="childName"
          value={form.childName}
          onChange={handleChange}
          placeholder="e.g. Ethan"
        />
        <Input
          as="select"
          label="Child's level"
          name="childLevel"
          value={form.childLevel}
          onChange={handleChange}
        >
          {CHILD_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
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
