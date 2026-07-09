import { Link, Navigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { getDashboardPath } from '../utils/constants.js';

const FEATURES = [
  {
    title: 'Scheduling',
    desc: 'Classes and one-off sessions on a shared calendar. Attendance takes seconds to mark.',
  },
  {
    title: 'Invoicing & payments',
    desc: 'Attendance turns straight into invoices. Track who has paid and who is overdue, PayNow-ready.',
  },
  {
    title: 'Centre & staff management',
    desc: 'Bring your tutors onto one organisation account with their own scoped dashboards.',
  },
];

const STEPS = [
  {
    title: 'Set up your account',
    desc: 'Sign up as an individual tutor or bring your whole centre onboard as staff.',
  },
  {
    title: 'Run your classes',
    desc: 'Schedule sessions, take attendance, and keep every student record in one place.',
  },
  {
    title: 'Get paid, on time',
    desc: 'Send invoices straight from attendance and track payments without chasing spreadsheets.',
  },
];

const Landing = () => {
  const { user, loading } = useAuth();

  // Already signed in — skip the pitch and go straight to their dashboard.
  if (!loading && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <div className="pb-24">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
            For tutors & tuition centres in Singapore
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-gray-100 sm:text-[3.4rem]">
            Grow your tuition
            <br />
            business, not your admin.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Scheduling, attendance and invoicing in one place — so you spend less time on
            spreadsheets and more time teaching.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <Button className="px-7 py-3 text-base">Get started free</Button>
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-primary-600 hover:underline dark:text-gray-300 dark:hover:text-primary-400"
            >
              I already have an account
            </Link>
          </div>

          <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
            Running a tuition centre?{' '}
            <Link
              to="/register?role=centre"
              className="font-medium text-gray-900 underline decoration-primary-400 decoration-2 underline-offset-4 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
            >
              Set up your organisation
            </Link>{' '}
            and bring your tutors on as staff.
          </p>
        </div>

        {/* Product preview: a mock of the attendance → invoice flow */}
        <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
          {/* Offset backdrop card */}
          <div className="absolute -right-3 top-4 h-full w-full rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />

          <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Sec 4 A-Maths</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today · 4:00–5:30pm</p>
              </div>
              <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Attendance taken
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { name: 'Wei Jun', status: 'Present' },
                { name: 'Kim An', status: 'Present' },
                { name: 'Jay En', status: 'Late' },
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-gray-800"
                >
                  <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{s.status}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Invoice #0231
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  S$450
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    /3 students
                  </span>
                </p>
              </div>
              <span className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">
                Send invoice
              </span>
            </div>
          </div>

          <p className="relative mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Example — invoices generate straight from attendance
          </p>
        </div>
      </section>

      {/* ── Feature highlights ───────────────────────────────── */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="max-w-md">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
            Everything the day-to-day needs
          </h2>
        </div>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            From sign-up to first invoice
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No agency fees, no separate spreadsheets. Everything happens on the platform.
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
              Ready to run your tuition business without the spreadsheets?
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Create a free account and set up your first class today.
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
