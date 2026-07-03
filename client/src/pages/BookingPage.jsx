import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import BookingForm from '../components/booking/BookingForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { fetchTutorById, getErrorMessage } from '../services/api.js';

const BookingPage = () => {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTutorById(tutorId)
      .then((res) => setTutor(res.data.tutor))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [tutorId]);

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error)
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </p>
    );
  if (!tutor) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to={`/tutors/${tutor._id}`}
        className="text-sm text-primary-600 hover:underline dark:text-primary-400"
      >
        ← Back to {tutor.user?.name}'s profile
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Book a Session</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          with{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {tutor.user?.name}
          </span>{' '}
          · S${tutor.hourlyRate}/hour
        </p>

        <div className="mt-6">
          <BookingForm tutor={tutor} />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
