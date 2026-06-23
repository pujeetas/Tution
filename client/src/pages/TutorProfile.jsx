import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Button from '../components/common/Button.jsx';
import { fetchTutorById, getErrorMessage } from '../services/api.js';

const MODE_LABELS = {
  online: 'Online only',
  'in-person': 'In-person only',
  both: 'Online & In-person',
};

const TutorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchTutorById(id)
      .then((res) => setTutor(res.data.tutor))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading tutor profile..." />;
  if (error)
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!tutor) return null;

  const canBook = !user || user.role === 'parent';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/tutors" className="text-sm text-primary-600 hover:underline">
        ← Back to all tutors
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tutor.user?.name}</h1>
            <p className="mt-1 text-gray-500">
              {tutor.yearsExperience}{' '}
              {tutor.yearsExperience === 1 ? 'year' : 'years'} of teaching experience
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">S${tutor.hourlyRate}</p>
            <p className="text-sm text-gray-400">per hour</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Subjects
            </dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {tutor.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                >
                  {s}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Levels
            </dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {tutor.levels.map((l) => (
                <span
                  key={l}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                >
                  {l}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Teaching mode
            </dt>
            <dd className="mt-1 text-sm text-gray-700">{MODE_LABELS[tutor.teachingMode]}</dd>
          </div>
        </dl>

        {tutor.bio && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              About
            </h2>
            <p className="mt-1 whitespace-pre-line text-gray-700">{tutor.bio}</p>
          </div>
        )}

        {canBook && (
          <div className="mt-8">
            <Link to={`/book/${tutor._id}`}>
              <Button className="w-full px-6 py-3 text-base sm:w-auto">
                Book a Session
              </Button>
            </Link>
            {!user && (
              <p className="mt-2 text-xs text-gray-400">
                You'll be asked to log in as a parent to complete the booking.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorProfile;
