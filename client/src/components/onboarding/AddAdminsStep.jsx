import AdminForm from '../centre/AdminForm.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import useOrgAdmins from '../../hooks/useOrgAdmins.js';

// Lightweight admin add-form + list for the onboarding "Add Users" step —
// unlike the full sidebar Admins page, no search/pagination/bulk-delete
// here, just enough to add a few admins during initial setup.
const AddAdminsStep = () => {
  const { admins, loading, error, refetch } = useOrgAdmins({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Add Admin
        </h3>
        <AdminForm onCreated={refetch} />
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Admins added ({admins.length})
        </h4>
        {loading ? (
          <LoadingSpinner message="Loading admins..." />
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : admins.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            No admins added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {admins.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {a.name}
                    {a.isOwner && (
                      <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
                        (Owner)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdminsStep;
