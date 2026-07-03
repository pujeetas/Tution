import { Link, Navigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { SUBJECTS } from '../utils/constants.js';

const STEPS = [
  {
    title: 'Create an account',
    desc: 'Free for parents and students. Tell us the level and subjects you need help with.',
  },
  {
    title: 'Compare tutors',
    desc: 'Filter by subject, level, hourly rate and mode. Every profile shows qualifications and reviews.',
  },
  {
    title: 'Book a session',
    desc: 'Pick a time that works. The tutor confirms and you get a reminder before the lesson.',
  },
];

const Landing = () => {
  const { user, loading } = useAuth();

  // Already signed in — skip the pitch and go straight to browsing tutors.
  if (!loading && user) {
    return <Navigate to="/tutors" replace />;
  }

  return (
    <div className="pb-24">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
            Tuition in Singapore
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-gray-100 sm:text-[3.4rem]">
            The right tutor,
            <br />
            without the guesswork.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Browse qualified tutors for PSLE, O-Level and A-Level subjects. See real
            qualifications, rates and reviews before you book — online or at your place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <Button className="px-7 py-3 text-base">Find a tutor</Button>
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-primary-600 hover:underline dark:text-gray-300 dark:hover:text-primary-400"
            >
              I already have an account
            </Link>
          </div>

          <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
            Teaching?{' '}
            <Link
              to="/register?role=tutor"
              className="font-medium text-gray-900 underline decoration-primary-400 decoration-2 underline-offset-4 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
            >
              List your tutor profile
            </Link>{' '}
            — it takes about five minutes.
          </p>
        </div>

        {/* Product preview: a sample tutor card, so visitors see exactly what they get */}
        <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
          {/* Offset backdrop card */}
          <div className="absolute -right-3 top-4 h-full w-full rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />

          <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  WL
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Ms Wei Lin</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    NIE-trained · 8 yrs experience
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                ★ 4.9
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {['O-Level E-Math', 'A-Math', 'Sec 3–4'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  From
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  $55
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    /hr
                  </span>
                </p>
              </div>
              <span className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">
                View profile
              </span>
            </div>
          </div>

          <p className="relative mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Example profile — sign up to browse all tutors
          </p>
        </div>
      </section>

      {/* ── Subjects strip ───────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
            Browse by subject
          </h2>
          <Link
            to="/tutors"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            See all tutors →
          </Link>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SUBJECTS.map((s) => (
            <Link
              key={s}
              to={`/tutors?subject=${encodeURIComponent(s)}`}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            From sign-up to first lesson
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No agency fees, no phone calls back and forth. Everything happens on the platform.
          </p>
        </div>

        <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              {/* Connecting rule between steps on desktop */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-10 right-0 top-4 hidden h-px bg-gray-200 dark:bg-gray-800 sm:block" />
              )}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white text-sm font-semibold text-primary-700 dark:bg-gray-900 dark:text-primary-400">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gray-900 px-8 py-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Exams don't wait. Neither should you.
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Create a free account and message a tutor today.
            </p>
          </div>
          <Link to="/register" className="shrink-0">
            <Button className="px-6 py-3 text-base">Get started free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;