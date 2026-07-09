const Footer = () => (
  <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
      <p>
        © {new Date().getFullYear()} TuitionHub SG. Scheduling, attendance and invoicing for
        tutors and tuition centres.
      </p>
      <p>Built for PSLE, O-Levels & A-Levels.</p>
    </div>
  </footer>
);

export default Footer;
