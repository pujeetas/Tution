import { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import useBookings from '../../hooks/useBookings.js';
import CentreInfo from './CentreInfo.jsx';
import BookingCard from '../booking/BookingCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { getErrorMessage } from '../../services/api.js';

// Students and Staff Tutors management moved to the sidebar's "Manage
// Database" pages (/dashboard/students, /dashboard/staff), matching the
// Figma IA.
const TABS = ['Bookings', 'Organization'];

const CentreDashboard = () => {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, error: bookingsError, setStatus } = useBookings();

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

      {tab === 'Organization' && <CentreInfo />}
    </div>
  );
};

export default CentreDashboard;
