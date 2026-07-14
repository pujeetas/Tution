import ClassForm from '../classes/ClassForm.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import useClasses from '../../hooks/useClasses.js';

// Lightweight class add-form + list for the onboarding "Create Classes" step —
// unlike the full sidebar Classes page, no search/filter/pagination/bulk-delete
// here, just enough to set up a first class during initial setup.
const AddClassesStep = () => {
  const { classes, loading, error, refetch } = useClasses({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Add A New Class
        </h3>
        <ClassForm onSaved={refetch} />
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Classes added ({classes.length})
        </h4>
        {loading ? (
          <LoadingSpinner message="Loading classes..." />
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : classes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            No classes added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {classes.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {c.level} · {c.subject}
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

export default AddClassesStep;
