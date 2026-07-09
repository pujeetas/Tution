import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useBookings from '../../hooks/useBookings.js';
import BookingCard from '../booking/BookingCard.jsx';
import StudentsPanel from './StudentsPanel.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { isUpcoming } from '../../utils/formatDate.js';
import { getErrorMessage } from '../../services/api.js';

const ParentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { bookings, loading, error, setStatus, pay } = useBookings();
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

  const handlePay = async (id) => {
    setActionError('');
    setUpdating(true);
    try {
      await pay(id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const outstanding = bookings.filter(
    (b) => b.status === 'Confirmed' && b.paymentStatus === 'unpaid'
  );
  const upcoming = bookings.filter(
    (b) => isUpcoming(b.date) && b.status !== 'Cancelled' && b.status !== 'Completed'
  );
  const past = bookings.filter((b) => !upcoming.includes(b));

  if (loading) return <LoadingSpinner message="Loading your bookings..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your children's sessions and payments
        </p>
      </div>

      {location.state?.message && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {location.state.message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
      {actionError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {actionError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          {outstanding.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Outstanding Payments ({outstanding.length})
              </h2>
              <div className="space-y-4">
                {outstanding.map((b) => (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    viewerRole="parent"
                    onStatusChange={handleStatusChange}
                    onPay={handlePay}
                    updating={updating}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upcoming Sessions ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                No upcoming sessions yet. Your tutor or centre will schedule these for you.
              </p>
            ) : (
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    viewerRole="parent"
                    onStatusChange={handleStatusChange}
                    onPay={handlePay}
                    updating={updating}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Past & Other Bookings ({past.length})
            </h2>
            {past.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No past bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {past.map((b) => (
                  <BookingCard key={b._id} booking={b} viewerRole="parent" />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <StudentsPanel />
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Don't have a tutor yet?{' '}
            <Link to="/tutors" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
              Browse tutors
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
};

export default ParentDashboard;
