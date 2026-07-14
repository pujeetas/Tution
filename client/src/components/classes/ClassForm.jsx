import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import useAuth from '../../hooks/useAuth.js';
import useAddedStudents from '../../hooks/useAddedStudents.js';
import { createClass, updateClass, fetchClassTutorOptions, getErrorMessage } from '../../services/api.js';
import { CHILD_LEVELS, SUBJECTS, LESSON_TYPES, CLASS_DAYS, CLASS_VISIBILITIES } from '../../utils/constants.js';

const EMPTY_FORM = {
  name: '',
  lessonType: 'Group',
  dayOfWeek: '',
  startTime: '',
  endTime: '',
  level: '',
  subject: '',
  location: '',
  tutors: [],
  students: [],
  description: '',
  visibility: 'Public',
};

const formFromClass = (klass) =>
  klass
    ? {
        name: klass.name || '',
        lessonType: klass.lessonType || 'Group',
        dayOfWeek: klass.schedule?.dayOfWeek || '',
        startTime: klass.schedule?.startTime || '',
        endTime: klass.schedule?.endTime || '',
        level: klass.level || '',
        subject: klass.subject || '',
        location: klass.location || '',
        tutors: (klass.tutors || []).map((t) => t._id),
        students: (klass.students || []).map((s) => s._id),
        description: klass.description || '',
        visibility: klass.visibility || 'Public',
      }
    : EMPTY_FORM;

// Standalone class form, shared by ClassesPage (add + edit), the onboarding
// AddClassesStep, and the edit modal — mirrors AdminForm.jsx's {onSaved}
// pattern. Pass `classToEdit` to switch it into edit mode (pre-filled,
// submits via updateClass); omit it to create a new class.
const ClassForm = ({ classToEdit, onSaved }) => {
  const isEdit = Boolean(classToEdit);
  const [form, setForm] = useState(() => formFromClass(classToEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tutorOptions, setTutorOptions] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  const { user } = useAuth();
  const { students: studentOptions } = useAddedStudents({ page: 1, limit: 200 });

  useEffect(() => {
    let cancelled = false;
    fetchClassTutorOptions()
      .then((res) => {
        if (!cancelled) setTutorOptions(res.data.tutors);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoadingTutors(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // A single returned option only means "it's just me" for an individual
  // tutor (getClassTutorOptions always returns exactly [self] for them). For
  // a centre, one staff tutor is still someone the admin must actively pick,
  // not an implicit "you" — so only lock the field when that one option's id
  // is the current user's own id.
  const soloTutor =
    tutorOptions.length === 1 && tutorOptions[0]._id === user.id ? tutorOptions[0] : null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMultiChange = (name) => (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm({ ...form, [name]: values });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.level || !form.subject) {
      return setError('Class name, level and subject are required');
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        lessonType: form.lessonType,
        schedule: {
          dayOfWeek: form.dayOfWeek || undefined,
          startTime: form.startTime,
          endTime: form.endTime,
        },
        level: form.level,
        subject: form.subject,
        location: form.location,
        tutors: soloTutor ? [soloTutor._id] : form.tutors,
        students: form.students,
        description: form.description,
        visibility: form.visibility,
      };
      const res = isEdit ? await updateClass(classToEdit._id, payload) : await createClass(payload);
      setSuccess(`${res.data.class.name} was ${isEdit ? 'updated' : 'created'}`);
      if (!isEdit) setForm(EMPTY_FORM);
      onSaved?.(res.data.class);
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
        <Input label="Class name" name="name" required value={form.name} onChange={handleChange} />

        <Input
          label="Lesson type"
          name="lessonType"
          as="select"
          value={form.lessonType}
          onChange={handleChange}
        >
          {LESSON_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Input>

        <Input label="Level" name="level" as="select" required value={form.level} onChange={handleChange}>
          <option value="">Select a level</option>
          {CHILD_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Input>

        <Input label="Subject" name="subject" as="select" required value={form.subject} onChange={handleChange}>
          <option value="">Select a subject</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Input>

        <Input label="Day of week" name="dayOfWeek" as="select" value={form.dayOfWeek} onChange={handleChange}>
          <option value="">Select a day</option>
          {CLASS_DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Input>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start time" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
          <Input label="End time" name="endTime" type="time" value={form.endTime} onChange={handleChange} />
        </div>

        <Input
          label="Class location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. AMK Centre"
        />

        {soloTutor ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assign tutors
            </span>
            <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              You'll be the tutor for this class
            </p>
          </label>
        ) : (
          <Input
            label="Assign tutors"
            name="tutors"
            as="select"
            multiple
            value={form.tutors}
            onChange={handleMultiChange('tutors')}
            disabled={loadingTutors}
          >
            {tutorOptions.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </Input>
        )}

        <Input
          label="Assign students"
          name="students"
          as="select"
          multiple
          value={form.students}
          onChange={handleMultiChange('students')}
        >
          {studentOptions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </Input>

        <Input
          label="Description"
          name="description"
          as="textarea"
          className="sm:col-span-2"
          value={form.description}
          onChange={handleChange}
        />

        <fieldset className="sm:col-span-2">
          <legend className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Visibility
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            {CLASS_VISIBILITIES.map((v) => (
              <label key={v.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="visibility"
                  value={v.value}
                  checked={form.visibility === v.value}
                  onChange={handleChange}
                  className="text-primary-600 focus:ring-primary-500"
                />
                {v.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Class'}
      </Button>
    </form>
  );
};

export default ClassForm;
