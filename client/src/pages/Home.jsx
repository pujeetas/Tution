import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { SUBJECTS } from '../utils/constants.js';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Find the right tutor for your child in{' '}
          <span className="text-primary-600">Singapore</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Qualified tutors for PSLE, O-Levels and A-Levels. Browse profiles, compare rates and
          book a session — online or in-person.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/tutors">
            <Button className="px-6 py-3 text-base">Browse Tutors</Button>
          </Link>
          {!user && (
            <Link to="/register?role=tutor">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Become a Tutor
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Subjects */}
      <section className="mx-auto max-w-4xl text-center">
        <h2 className="text-xl font-semibold text-gray-900">Popular Subjects</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SUBJECTS.map((s) => (
            <Link
              key={s}
              to={`/tutors?subject=${encodeURIComponent(s)}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:border-primary-400 hover:text-primary-600"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl">
        <h2 className="text-center text-xl font-semibold text-gray-900">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            ['1. Browse', 'Filter tutors by subject, level, teaching mode and budget.'],
            ['2. Book', "Pick a date and time that fits your child's schedule."],
            ['3. Learn', 'The tutor confirms and your child starts improving.'],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <h3 className="font-semibold text-primary-600">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
