import { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import useBookings from '../../hooks/useBookings.js';
import useStaff from '../../hooks/useStaff.js';
import StaffTutorForm from './StaffTutorForm.jsx';
import CentreInfo from './CentreInfo.jsx';
import BookingCard from '../booking/BookingCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { getErrorMessage } from '../../services/api.js';

// Students management moved to the sidebar's "Manage Database → Students"
// page (/dashboard/students), matching the Figma IA.
const TABS = ['Bookings', 'Staff Tutors', 'Organization'];

const CentreDashboard = () => {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, error: bookingsError, setStatus } = useBookings();
  const { staff, loading: staffLoading, error: staffError, refetch: refetchStaff } = useStaff();

  const [tab, setTab] = useState('Bookings');
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleStatusChange = async (id, status) => {
    setActionError('');
    setUpdating(true);
    try {
      await setStatus(id, status);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const pending = bookings.filter((b) => b.status === 'Pending');
  const confirmed = bookings.filter((b) => b.status === 'Confirmed');
  const others = bookings.filter((b) => b.status !== 'Pending' && b.status !== 'Confirmed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Centre Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t}
            {t === 'Bookings' && pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                {pending.length}
              </span>
            )}
            {t === 'Staff Tutors' && staff.length > 0 && (
              <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {staff.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Bookings' &&
        (bookingsLoading ? (
          <LoadingSpinner message="Loading bookings..." />
        ) : (
          <div className="space-y-8">
            {bookingsError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {bookingsError}
              </p>
            )}
            {actionError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {actionError}
              </p>
            )}

            {bookings.length === 0 && (
              <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                No bookings yet across your staff tutors.
              </p>
            )}

            {[
              ['Pending Requests', pending],
              ['Confirmed Sessions', confirmed],
              ['Past & Other', others],
            ].map(
              ([title, list]) =>
                list.length > 0 && (
                  <section key={title}>
                    <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {title} ({list.length})
                    </h2>
                    <div className="space-y-4">
                      {list.map((b) => (
                        <BookingCard
                          key={b._id}
                          booking={b}
                          viewerRole="centre"
                          onStatusChange={handleStatusChange}
                          updating={updating}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        ))}

      {tab === 'Staff Tutors' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Add Staff Tutor
            </h3>
            <StaffTutorForm onCreated={refetchStaff} />
          </div>

          <aside className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Your Tutors
            </h3>
            {staffLoading ? (
              <LoadingSpinner message="Loading staff..." />
            ) : staffError ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {staffError}
              </p>
            ) : staff.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                No staff tutors yet.
              </p>
            ) : (
              staff.map((s) => (
                <div
                  key={s._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100">{s.user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.user?.email}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {s.subjects.join(', ')} · S${s.hourlyRate}/hr
                  </p>
                </div>
              ))
            )}
          </aside>
        </div>
      )}

      {tab === 'Organization' && <CentreInfo />}
    </div>
  );
};

export default CentreDashboard;
