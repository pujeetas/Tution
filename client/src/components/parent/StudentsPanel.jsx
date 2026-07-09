import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import useStudents from '../../hooks/useStudents.js';
import { CHILD_LEVELS } from '../../utils/constants.js';
import { getErrorMessage } from '../../services/api.js';

const EMPTY_FORM = { name: '', level: 'Primary' };

// Sidebar card: list the parent's students, edit/delete them, add new ones
const StudentsPanel = () => {
  const { students, loading, error, addStudent, editStudent, removeStudent } = useStudents();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditForm({ name: student.name, level: student.level });
    setActionError('');
  };

  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = async (id) => {
    setActionError('');
    setSaving(true);
    try {
      await editStudent(id, editForm);
      setEditingId(null);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setActionError('');
    try {
      await removeStudent(id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionError('');

    if (!addForm.name.trim()) return setActionError("Please enter the student's name");

    setSaving(true);
    try {
      await addStudent({ name: addForm.name.trim(), level: addForm.level });
      setAddForm(EMPTY_FORM);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Your Students
      </h3>

      {(error || actionError) && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error || actionError}
        </p>
      )}

      {loading ? (
        <LoadingSpinner message="Loading students..." />
      ) : students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-3 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No students yet. Add one below to start booking.
        </p>
      ) : (
        <div className="space-y-2">
          {students.map((s) =>
            editingId === s._id ? (
              <div
                key={s._id}
                className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
              >
                <Input
                  name="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <Input
                  as="select"
                  name="level"
                  value={editForm.level}
                  onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                >
                  {CHILD_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Input>
                <div className="flex gap-2">
                  <Button disabled={saving} onClick={() => handleSaveEdit(s._id)}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.level}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s._id)}
                    className="font-medium text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <form onSubmit={handleAdd} className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
        <Input
          label="Add a student"
          name="name"
          value={addForm.name}
          onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          placeholder="e.g. Ethan"
        />
        <Input
          as="select"
          name="level"
          value={addForm.level}
          onChange={(e) => setAddForm({ ...addForm, level: e.target.value })}
        >
          {CHILD_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Input>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Adding...' : 'Add Student'}
        </Button>
      </form>
    </div>
  );
};

export default StudentsPanel;
