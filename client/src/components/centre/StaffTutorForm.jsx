import { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { TEACHING_MODES } from '../../utils/constants.js';
import { fetchStaffOptions, createStaffTutor, getErrorMessage } from '../../services/api.js';

const CheckboxGroup = ({ label, options, selected, onToggle }) => (
  <fieldset>
    <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            type="button"
            key={option}
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              checked
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:border-primary-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-primary-500'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  subjects: [],
  levels: [],
  teachingMode: 'online',
  hourlyRate: '',
  bio: '',
  yearsExperience: '',
};

// Form for a centre admin to add a new staff tutor account
const StaffTutorForm = ({ onCreated }) => {
  const [options, setOptions] = useState({ subjects: [], levels: [] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStaffOptions()
      .then((res) => setOptions({ subjects: res.data.subjects, levels: res.data.levels }))
      .catch(() => setOptions({ subjects: [], levels: [] }));
  }, []);

  const toggleIn = (field) => (value) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.subjects.length === 0) return setError('Select at least one subject');
    if (form.levels.length === 0) return setError('Select at least one level');
    if (!form.hourlyRate || Number(form.hourlyRate) < 1)
      return setError('Enter a valid hourly rate');

    setSaving(true);
    try {
      const res = await createStaffTutor({
        ...form,
        hourlyRate: Number(form.hourlyRate),
        yearsExperience: Number(form.yearsExperience) || 0,
      });
      setSuccess(`${res.data.tutor.name} was added to your centre`);
      setForm(EMPTY_FORM);
      onCreated?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="name" required value={form.name} onChange={handleChange} />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <Input
          label="Initial password"
          name="password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
        />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="+65 9123 4567"
        />
      </div>

      <CheckboxGroup
        label="Subjects taught"
        options={options.subjects}
        selected={form.subjects}
        onToggle={toggleIn('subjects')}
      />

      <CheckboxGroup
        label="Levels taught"
        options={options.levels}
        selected={form.levels}
        onToggle={toggleIn('levels')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          as="select"
          label="Teaching mode"
          name="teachingMode"
          value={form.teachingMode}
          onChange={handleChange}
        >
          {TEACHING_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Input>
        <Input
          label="Hourly rate (SGD)"
          name="hourlyRate"
          type="number"
          min="1"
          step="1"
          placeholder="e.g. 50"
          value={form.hourlyRate}
          onChange={handleChange}
        />
        <Input
          label="Years of experience"
          name="yearsExperience"
          type="number"
          min="0"
          step="1"
          placeholder="e.g. 5"
          value={form.yearsExperience}
          onChange={handleChange}
        />
      </div>

      <Input
        as="textarea"
        label="Bio"
        name="bio"
        placeholder="Tell parents about this tutor's teaching style and track record..."
        value={form.bio}
        onChange={handleChange}
        maxLength={1000}
      />

      <Button type="submit" disabled={saving}>
        {saving ? 'Adding tutor...' : 'Add Staff Tutor'}
      </Button>
    </form>
  );
};

export default StaffTutorForm;
