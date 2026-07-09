// Styled table shell — children are raw <thead>/<tbody> markup from the caller.
// `min-w-full` (not `w-full`) so the table can grow past its container and
// let the wrapper's overflow-x-auto scroll it, instead of squeezing columns
// to fit — matters in narrow contexts like the onboarding panel embed.
const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
    <table className={`min-w-full text-left text-sm ${className}`}>{children}</table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{children}</tbody>
);

export const Th = ({ children, className = '' }) => (
  <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>
);

export const Td = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${className}`}>{children}</td>
);

export default Table;
