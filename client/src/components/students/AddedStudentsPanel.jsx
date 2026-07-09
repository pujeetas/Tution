import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { fetchAddedStudents, addStudentForParent, getErrorMessage } from '../../services/api.js';
import { CHILD_LEVELS } from '../../utils/constants.js';

const EMPTY_FORM = {
  studentName: '',
  level: 'Primary',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  parentPassword: '',
};

// Lets a tutor/centre admin add a student on a parent's behalf — either
// linking to an existing parent account (matched by email) or creating a new
// one, mirroring how centre admins already create staff tutor accounts
// directly (no email-invite delivery exists yet).
const AddedStudentsPanel = ({ onAdded }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAddedStudents();
      setStudents(res.data.students);
      setListError('');
    } catch (err) {
      setListError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!form.studentName.trim() || !form.parentEmail.trim()) {
      return setError("Student name and parent email are required");
    }

    setSaving(true);
    try {
      const res = await addStudentForParent(form);
      setNotice(
        res.data.createdNewParent
          ? `Added ${form.studentName} and created a new parent account for ${res.data.parent.email}.`
          : `Added ${form.studentName} and linked to the existing parent account for ${res.data.parent.email}.`
      );
      setForm(EMPTY_FORM);
      await load();
      onAdded?.(res.data.student);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add a student</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            If the parent's email already has an account, the student is linked to it. Otherwise
            we create a new parent account with the password you set here.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {notice}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Student's full name"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="e.g. Ethan Tan"
          />
          <Input
            as="select"
            label="Level"
            name="level"
            value={form.level}
            onChange={handleChange}
          >
            {CHILD_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Input>
          <Input
            label="Parent's full name"
            name="parentName"
            value={form.parentName}
            onChange={handleChange}
            placeholder="Required if the parent is new"
          />
          <Input
            label="Parent's email"
            name="parentEmail"
            type="email"
            value={form.parentEmail}
            onChange={handleChange}
            placeholder="parent@example.com"
          />
          <Input
            label="Parent's phone"
            name="parentPhone"
            type="tel"
            value={form.parentPhone}
            onChange={handleChange}
            placeholder="Required if the parent is new"
          />
          <Input
            label="Parent's password"
            name="parentPassword"
            type="password"
            value={form.parentPassword}
            onChange={handleChange}
            placeholder="Required if the parent is new"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? 'Adding...' : 'Add Student'}
        </Button>
      </form>

      <div>
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
          Students you've added ({students.length})
        </h3>
        {loading ? (
          <LoadingSpinner message="Loading students..." />
        ) : listError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{listError}</p>
        ) : students.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            No students added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {students.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {s.level} · Parent: {s.parent?.name} ({s.parent?.email})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddedStudentsPanel;
