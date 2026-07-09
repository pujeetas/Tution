import { useEffect, useMemo, useState } from 'react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Badge from '../components/common/Badge.jsx';
import Checkbox from '../components/common/Checkbox.jsx';
import Table, { TableHead, TableBody, Th, Td } from '../components/common/Table.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AdminForm from '../components/centre/AdminForm.jsx';
import useOrgAdmins from '../hooks/useOrgAdmins.js';
import { bulkDeleteAdmins, getErrorMessage } from '../services/api.js';

const LIMIT = 10;

// Sidebar "Manage Database → Admins" page for centres. Every admin has
// identical full access to the organization — "Owner" is a display-only
// label for whoever created the organization, not a permission tier. The
// owner can never be selected/deleted here (server also enforces this).
const AdminsPage = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const filters = useMemo(
    () => ({ search: debouncedSearch, page, limit: LIMIT }),
    [debouncedSearch, page]
  );

  const { admins, meta, loading, error, refetch } = useOrgAdmins(filters);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [admins]);

  const selectableAdmins = admins.filter((a) => !a.isOwner);
  const allSelected = selectableAdmins.length > 0 && selectedIds.size === selectableAdmins.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(selectableAdmins.map((a) => a._id)));
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
      await bulkDeleteAdmins([...selectedIds]);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admins</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Admins have full access to your organization's bookings, staff, students and settings.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button type="button" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Cancel' : 'Add Admin'}
        </Button>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Names..."
          className="ml-auto max-w-xs"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {rangeStart} - {rangeEnd} out of {meta.total} admins
      </p>

      {showAddForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Add Admin
          </h3>
          <AdminForm
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
            {bulkDeleting ? 'Deleting...' : 'Delete Admins'}
          </Button>
          {bulkError && <span className="text-sm text-red-600 dark:text-red-400">{bulkError}</span>}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading admins..." />
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : admins.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No admins found.
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
                <Th>Phone Number</Th>
                <Th>Email Address</Th>
                <Th>Status</Th>
              </tr>
            </TableHead>
            <TableBody>
              {admins.map((a) => (
                <tr key={a._id}>
                  <Td>
                    <Checkbox
                      checked={selectedIds.has(a._id)}
                      onChange={() => toggleOne(a._id)}
                      disabled={a.isOwner}
                      title={a.isOwner ? 'The organization owner cannot be removed' : undefined}
                    />
                  </Td>
                  <Td className="font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      {a.name}
                      {a.isOwner && (
                        <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                          Owner
                        </Badge>
                      )}
                    </div>
                  </Td>
                  <Td>{a.phone || '—'}</Td>
                  <Td>{a.email}</Td>
                  <Td>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </Badge>
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
    </div>
  );
};

export default AdminsPage;
