const ORDER = ['Present', 'Late', 'Absent'];

const STYLES = {
  Present:
    'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  Late: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  Absent: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

// Single-tap cycle: Present -> Late -> Absent -> Present. The fast path
// (everyone showed up) costs zero taps since Present is already the default;
// the tutor only ever taps the exceptions.
const AttendanceChip = ({ status, onChange }) => {
  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(status) + 1) % ORDER.length];
    onChange(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className={`w-24 shrink-0 rounded-full border px-3 py-1 text-center text-xs font-semibold transition-colors ${STYLES[status]}`}
    >
      {status}
    </button>
  );
};

export default AttendanceChip;
