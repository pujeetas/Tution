import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Checkbox from '../components/common/Checkbox.jsx';
import Table, { TableHead, TableBody, Th, Td } from '../components/common/Table.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ClassForm from '../components/classes/ClassForm.jsx';
import Modal from '../components/common/Modal.jsx';
import useClasses from '../hooks/useClasses.js';
import { bulkDeleteClasses, getErrorMessage } from '../services/api.js';
import { CHILD_LEVELS, SUBJECTS } from '../utils/constants.js';

const LIMIT = 10;

const scheduleLabel = (schedule) => {
  if (!schedule?.dayOfWeek) return '—';
  const time = schedule.startTime && schedule.endTime ? ` ${schedule.startTime}-${schedule.endTime}` : '';
  return `${schedule.dayOfWeek}${time}`;
};

// Sidebar "Classes" page for tutors and centres. Mirrors AdminsPage.jsx's
// search/filter/paginate/bulk-delete pattern.
const ClassesPage = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [level, setLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, level, subject]);

  const filters = useMemo(
    () => ({ search: debouncedSearch, level, subject, page, limit: LIMIT }),
    [debouncedSearch, level, subject, page]
  );

  const { classes, meta, loading, error, refetch } = useClasses(filters);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [classes]);

  const allSelected = classes.length > 0 && selectedIds.size === classes.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(classes.map((c) => c._id)));
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
      await bulkDeleteClasses([...selectedIds]);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Classes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set up and manage your classes. Add, edit, or delete classes as needed.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button type="button" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Cancel' : 'Add A New Class'}
        </Button>
        <Input
          as="select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-auto"
        >
          <option value="">All levels</option>
          {CHILD_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Input>
        <Input
          as="select"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-auto"
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((s) => (
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
        Showing {rangeStart} - {rangeEnd} out of {meta.total} classes
      </p>

      {showAddForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Add A New Class
          </h3>
          <ClassForm
            onSaved={() => {
              setShowAddForm(false);
              refetch();
            }}
          />
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-900 dark:bg-primary-900/20">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedIds.size} selected
          </span>
          <Button type="button" variant="danger" onClick={handleBulkDelete} disabled={bulkDeleting}>
            {bulkDeleting ? 'Deleting...' : 'Delete Classes'}
          </Button>
          {bulkError && <span className="text-sm text-red-600 dark:text-red-400">{bulkError}</span>}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading classes..." />
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : classes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No classes found.
        </p>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                <Th className="w-10">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </Th>
                <Th>Class Title</Th>
                <Th>Level</Th>
                <Th>Schedule</Th>
                <Th>Teachers</Th>
                <Th>Students</Th>
                <Th className="w-16" />
              </tr>
            </TableHead>
            <TableBody>
              {classes.map((c) => (
                <tr key={c._id}>
                  <Td>
                    <Checkbox checked={selectedIds.has(c._id)} onChange={() => toggleOne(c._id)} />
                  </Td>
                  <Td className="font-medium text-gray-900 dark:text-gray-100">
                    <div>{c.name}</div>
                    <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {c.location ? `${scheduleLabel(c.schedule)} · ${c.location}` : scheduleLabel(c.schedule)}
                    </div>
                  </Td>
                  <Td>{c.level}</Td>
                  <Td>{scheduleLabel(c.schedule)}</Td>
                  <Td>{c.tutors?.map((t) => t.name).join(', ') || '—'}</Td>
                  <Td>{c.students?.length || 0}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/dashboard/classes/${c._id}/attendance`}
                        title="Mark attendance"
                        className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400"
                      >
                        ✓
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingClass(c)}
                        title="View / edit class"
                        className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400"
                      >
                        👁
                      </button>
                      <span
                        title="Messaging isn't available yet"
                        className="cursor-not-allowed text-gray-300 dark:text-gray-700"
                      >
                        ✉
                      </span>
                    </div>
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

      {editingClass && (
        <Modal title="Edit Class" onClose={() => setEditingClass(null)}>
          <ClassForm
            key={editingClass._id}
            classToEdit={editingClass}
            onSaved={() => {
              setEditingClass(null);
              refetch();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClassesPage;
