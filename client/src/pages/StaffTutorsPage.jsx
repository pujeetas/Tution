import { useEffect, useState } from 'react';
import Button from '../components/common/Button.jsx';
import Checkbox from '../components/common/Checkbox.jsx';
import Table, { TableHead, TableBody, Th, Td } from '../components/common/Table.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import StaffTutorForm from '../components/centre/StaffTutorForm.jsx';
import useStaff from '../hooks/useStaff.js';
import { bulkDeleteStaff, getErrorMessage } from '../services/api.js';

// Sidebar "Manage Database → Staff Tutors" page for centres. Previously this
// lived as a tab inside CentreDashboard — promoted to its own page, matching
// the same move already made for Students and Admins.
const StaffTutorsPage = () => {
  const { staff, loading, error, refetch } = useStaff();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkError, setBulkError] = useState('');
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [staff]);

  const allSelected = staff.length > 0 && selectedIds.size === staff.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(staff.map((s) => s._id)));
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
      await bulkDeleteStaff([...selectedIds]);
      setSelectedIds(new Set());
      await refetch();
    } catch (err) {
      setBulkError(getErrorMessage(err));
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Tutors</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tutors on your team who can be assigned to classes and bookings.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button type="button" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Cancel' : 'Add Staff Tutor'}
        </Button>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {staff.length} tutor{staff.length === 1 ? '' : 's'}
        </span>
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Add Staff Tutor
          </h3>
          <StaffTutorForm
            onCreated={() => {
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
            {bulkDeleting ? 'Removing...' : 'Remove Tutors'}
          </Button>
          {bulkError && <span className="text-sm text-red-600 dark:text-red-400">{bulkError}</span>}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading staff tutors..." />
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : staff.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No staff tutors yet. Add one to start assigning classes and bookings.
        </p>
      ) : (
        <Table>
          <TableHead>
            <tr>
              <Th className="w-10">
                <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
              </Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Subjects</Th>
              <Th>Levels</Th>
              <Th>Rate</Th>
            </tr>
          </TableHead>
          <TableBody>
            {staff.map((s) => (
              <tr key={s._id}>
                <Td>
                  <Checkbox checked={selectedIds.has(s._id)} onChange={() => toggleOne(s._id)} />
                </Td>
                <Td className="font-medium text-gray-900 dark:text-gray-100">{s.user?.name}</Td>
                <Td>{s.user?.email}</Td>
                <Td>{s.user?.phone || '—'}</Td>
                <Td>{s.subjects?.join(', ') || '—'}</Td>
                <Td>{s.levels?.join(', ') || '—'}</Td>
                <Td>S${s.hourlyRate}/hr</Td>
              </tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default StaffTutorsPage;
