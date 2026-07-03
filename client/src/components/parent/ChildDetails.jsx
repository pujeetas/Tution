// Compact card showing the parent's registered child info
const ChildDetails = ({ user }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
      Child Details
    </h3>
    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
      <p>
        <span className="font-medium">Name:</span> {user.childName || '—'}
      </p>
      <p>
        <span className="font-medium">Level:</span> {user.childLevel || '—'}
      </p>
    </div>
  </div>
);

export default ChildDetails;
