import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Badge from '../common/Badge.jsx';
import Checkbox from '../common/Checkbox.jsx';
import Table, { TableHead, TableBody, Th, Td } from '../common/Table.jsx';
import Modal from '../common/Modal.jsx';
import StudentForm from './StudentForm.jsx';
import useAddedStudents from '../../hooks/useAddedStudents.js';
import { bulkDeleteStudents, getErrorMessage } from '../../services/api.js';
import { CHILD_LEVELS, STUDENT_STATUSES, STUDENT_STATUS_COLORS } from '../../utils/constants.js';

const LIMIT = 10;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

// Lets a tutor/centre admin manage the students they've added: search/filter/
// paginate a table, bulk-delete, edit, and add new students (either linking
// to an existing parent account by email, or creating a new one — mirrors
// how centre admins already create staff tutor accounts directly, since
// there's no email-invite delivery yet).
const AddedStudentsPanel = ({ onAdded }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
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

  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * LIMIT + 1;
  const rangeEnd = Math.min(meta.page * LIMIT, meta.total);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button type="button" onClick={() => setShowAddForm((v) => !v)}>
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
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Add a student</h3>
          <StudentForm
            onSaved={(student) => {
              setShowAddForm(false);
              refetch();
              onAdded?.(student);
            }}
          />
        </div>
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
                <Th className="w-10" />
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
                  <Td>{s.classes?.length ? s.classes.join(', ') : 'Unassigned'}</Td>
                  <Td>
                    <Badge className={STUDENT_STATUS_COLORS[s.status] || STUDENT_STATUS_COLORS.Active}>
                      {s.status || 'Active'}
                    </Badge>
                  </Td>
                  <Td>{s.phone || '—'}</Td>
                  <Td>{formatDate(s.createdAt)}</Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => setEditingStudent(s)}
                      title="Edit student"
                      className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400"
                    >
                      ✎
                    </button>
                  </Td>
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

      {editingStudent && (
        <Modal title="Edit Student" onClose={() => setEditingStudent(null)}>
          <StudentForm
            key={editingStudent._id}
            studentToEdit={editingStudent}
            onSaved={() => {
              setEditingStudent(null);
              refetch();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default AddedStudentsPanel;
