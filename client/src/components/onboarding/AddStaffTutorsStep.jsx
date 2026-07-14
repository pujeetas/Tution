import StaffTutorForm from '../centre/StaffTutorForm.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import useStaff from '../../hooks/useStaff.js';

// Lightweight staff-tutor add-form + list for the onboarding "Add Users"
// step — unlike the full sidebar Staff Tutors page, no table here, just
// enough to get at least one tutor on the roster before Create Classes
// (which requires assigning a tutor to every class).
const AddStaffTutorsStep = () => {
  const { staff, loading, error, refetch } = useStaff();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Add Staff Tutor
        </h3>
        <StaffTutorForm onCreated={refetch} />
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Tutors added ({staff.length})
        </h4>
        {loading ? (
          <LoadingSpinner message="Loading staff tutors..." />
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : staff.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            No staff tutors added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {staff.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.user?.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStaffTutorsStep;
