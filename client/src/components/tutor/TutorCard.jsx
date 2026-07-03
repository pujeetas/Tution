import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

const MODE_LABELS = {
  online: 'Online',
  'in-person': 'In-person',
  both: 'Online & In-person',
};

const TutorCard = ({ tutor }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start justify-between gap-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {tutor.user?.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tutor.yearsExperience} {tutor.yearsExperience === 1 ? 'year' : 'years'} experience ·{' '}
          {MODE_LABELS[tutor.teachingMode]}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
          S${tutor.hourlyRate}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">per hour</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {tutor.subjects.map((s) => (
        <span
          key={s}
          className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
        >
          {s}
        </span>
      ))}
      {tutor.levels.map((l) => (
        <span
          key={l}
          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          {l}
        </span>
      ))}
    </div>

    {tutor.bio && (
      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{tutor.bio}</p>
    )}

    <div className="mt-auto pt-2">
      <Link to={`/tutors/${tutor._id}`}>
        <Button className="w-full">View Profile</Button>
      </Link>
    </div>
  </div>
);

export default TutorCard;
