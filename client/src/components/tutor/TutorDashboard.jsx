import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.js';
import useBookings from '../../hooks/useBookings.js';
import TutorProfileForm from './TutorProfileForm.jsx';
import BookingCard from '../booking/BookingCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { fetchMyTutorProfile, getErrorMessage } from '../../services/api.js';

// Students management moved to the sidebar's "Manage Database → Students"
// page (/dashboard/students), matching the Figma IA.
const TABS = ['Bookings', 'My Profile'];

const TutorDashboard = () => {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading, error: bookingsError, setStatus } = useBookings();

  const [tab, setTab] = useState('Bookings');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchMyTutorProfile()
      .then((res) => setProfile(res.data.profile))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, []);

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

  const needsProfile = !profileLoading && !profile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tutor Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
      </div>

      {needsProfile && (
        <p className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          Your profile is not set up yet — parents can't find you until it is. Fill in the
          "My Profile" tab to appear in search results.
        </p>
      )}

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

      {tab === 'Bookings' ? (
        bookingsLoading ? (
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
                No bookings yet. Once parents book you, requests will appear here.
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
                          viewerRole="tutor"
                          onStatusChange={handleStatusChange}
                          updating={updating}
                        />
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        )
      ) : profileLoading ? (
        <LoadingSpinner message="Loading profile..." />
      ) : (
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <TutorProfileForm profile={profile} onSaved={setProfile} />
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;
