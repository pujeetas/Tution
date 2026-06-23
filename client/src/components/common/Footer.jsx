const Footer = () => (
  <footer className="mt-auto border-t border-gray-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row">
      <p>
        © {new Date().getFullYear()} TuitionHub SG. Connecting Singapore families with great
        tutors.
      </p>
      <p>Built for PSLE, O-Levels & A-Levels.</p>
    </div>
  </footer>
);

export default Footer;
