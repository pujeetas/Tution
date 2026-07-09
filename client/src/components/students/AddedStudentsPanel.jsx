import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Badge from '../common/Badge.jsx';
import Checkbox from '../common/Checkbox.jsx';
import Table, { TableHead, TableBody, Th, Td } from '../common/Table.jsx';
import useAddedStudents from '../../hooks/useAddedStudents.js';
import { bulkDeleteStudents, addStudentForParent, getErrorMessage } from '../../services/api.js';
import { CHILD_LEVELS, STUDENT_STATUSES, STUDENT_STATUS_COLORS } from '../../utils/constants.js';

const EMPTY_FORM = {
  studentName: '',
  level: 'Primary',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  parentPassword: '',
};

const LIMIT = 10;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

// Lets a tutor/centre admin manage the students they've added: search/filter/
// paginate a table, bulk-delete, and add new students (either linking to an
// existing parent account by email, or creating a new one — mirrors how
// centre admins already create staff tutor accounts directly, since there's
// no email-invite delivery yet).
const AddedStudentsPanel = ({ onAdded }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, level, status]);

  const filters = useMemo(
    () => ({ search: debouncedSearch, level, status, page, limit: LIMIT }),
    [debouncedSearch, level, status, page]
  );

  const { students, meta, loading, error, refetch } = useAddedStudents(filters);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [students]);

  const allSelected = students.length > 0 && selectedIds.size === students.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(students.map((s) => s._id)));
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setBulkError('');
    setBulkDeleting(true);
    try {
      await bulkDeleteStudents([...selectedIds]);
      setSelectedIds(new Set());
      await refetch();
    } catch (err) {
      setBulkError(getErrorMessage(err));
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setNotice('');

    if (!form.studentName.trim() || !form.parentEmail.trim()) {
      return setFormError("Student name and parent email are required");
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
      setShowAddForm(false);
      await refetch();
      onAdded?.(res.data.student);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * LIMIT + 1;
  const rangeEnd = Math.min(meta.page * LIMIT, meta.total);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button
          type="button"
          onClick={() => {
            setShowAddForm((v) => !v);
            setFormError('');
            setNotice('');
          }}
        >
          {showAddForm ? 'Cancel' : 'Add Students'}
        </Button>
        <Input as="select" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All levels</option>
          {CHILD_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Input>
        <Input as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STUDENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Input>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Names, Classes..."
          className="ml-auto max-w-xs"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {rangeStart} - {rangeEnd} out of {meta.total} students
      </p>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add a student</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              If the parent's email already has an account, the student is linked to it.
              Otherwise we create a new parent account with the password you set here.
            </p>
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {formError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Student's full name"
              name="studentName"
              value={form.studentName}
              onChange={handleFormChange}
              placeholder="e.g. Ethan Tan"
            />
            <Input
              as="select"
              label="Level"
              name="level"
              value={form.level}
              onChange={handleFormChange}
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
              onChange={handleFormChange}
              placeholder="Required if the parent is new"
            />
            <Input
              label="Parent's email"
              name="parentEmail"
              type="email"
              value={form.parentEmail}
              onChange={handleFormChange}
              placeholder="parent@example.com"
            />
            <Input
              label="Parent's phone"
              name="parentPhone"
              type="tel"
              value={form.parentPhone}
              onChange={handleFormChange}
              placeholder="Required if the parent is new"
            />
            <Input
              label="Parent's password"
              name="parentPassword"
              type="password"
              value={form.parentPassword}
              onChange={handleFormChange}
              placeholder="Required if the parent is new"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Adding...' : 'Add Student'}
          </Button>
        </form>
      )}

      {notice && !showAddForm && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {notice}
        </p>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-900 dark:bg-primary-900/20">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedIds.size} selected
          </span>
          <Button
            type="button"
            variant="danger"
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
          >
            {bulkDeleting ? 'Deleting...' : 'Delete Students'}
          </Button>
          {bulkError && <span className="text-sm text-red-600 dark:text-red-400">{bulkError}</span>}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading students..." />
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No students found.
        </p>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                <Th className="w-10">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </Th>
                <Th>Name</Th>
                <Th>Level</Th>
                <Th>Class</Th>
                <Th>Status</Th>
                <Th>Phone Number</Th>
                <Th>Added On</Th>
              </tr>
            </TableHead>
            <TableBody>
              {students.map((s) => (
                <tr key={s._id}>
                  <Td>
                    <Checkbox checked={selectedIds.has(s._id)} onChange={() => toggleOne(s._id)} />
                  </Td>
                  <Td className="font-medium text-gray-900 dark:text-gray-100">{s.name}</Td>
                  <Td>{s.level}</Td>
                  <Td>—</Td>
                  <Td>
                    <Badge className={STUDENT_STATUS_COLORS[s.status] || STUDENT_STATUS_COLORS.Active}>
                      {s.status || 'Active'}
                    </Badge>
                  </Td>
                  <Td>{s.phone || '—'}</Td>
                  <Td>{formatDate(s.createdAt)}</Td>
                </tr>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {meta.page} of {meta.pages}
            </span>
            <Button
              type="button"
              variant="secondary"
              disabled={meta.page >= meta.pages}
              onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddedStudentsPanel;
