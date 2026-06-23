import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTutors from '../hooks/useTutors.js';
import TutorCard from '../components/tutor/TutorCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { SUBJECTS, LEVELS, SESSION_MODES } from '../utils/constants.js';

const TutorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      subject: searchParams.get('subject') || '',
      level: searchParams.get('level') || '',
      mode: searchParams.get('mode') || '',
      minRate: searchParams.get('minRate') || '',
      maxRate: searchParams.get('maxRate') || '',
    }),
    [searchParams]
  );

  const { tutors, loading, error } = useTutors(filters);

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next, { replace: true });
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
        <p className="text-sm text-gray-500">
          Browse qualified tutors across Singapore and book a session
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            as="select"
            label="Subject"
            value={filters.subject}
            onChange={(e) => updateFilter('subject', e.target.value)}
          >
            <option value="">All subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Input>
          <Input
            as="select"
            label="Level"
            value={filters.level}
            onChange={(e) => updateFilter('level', e.target.value)}
          >
            <option value="">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Input>
          <Input
            as="select"
            label="Teaching mode"
            value={filters.mode}
            onChange={(e) => updateFilter('mode', e.target.value)}
          >
            <option value="">Any mode</option>
            {SESSION_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Input>
          <Input
            label="Min rate (S$/h)"
            type="number"
            min="0"
            placeholder="e.g. 30"
            value={filters.minRate}
            onChange={(e) => updateFilter('minRate', e.target.value)}
          />
          <Input
            label="Max rate (S$/h)"
            type="number"
            min="0"
            placeholder="e.g. 80"
            value={filters.maxRate}
            onChange={(e) => updateFilter('maxRate', e.target.value)}
          />
        </div>
        {hasFilters && (
          <div className="mt-3">
            <Button variant="secondary" onClick={() => setSearchParams({}, { replace: true })}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner message="Finding tutors..." />
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : tutors.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No tutors match your filters. Try widening your search.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {tutors.length} {tutors.length === 1 ? 'tutor' : 'tutors'} found
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TutorList;
