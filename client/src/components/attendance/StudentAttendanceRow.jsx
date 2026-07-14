import AttendanceChip from './AttendanceChip.jsx';

const VALID_REASONS = ['Sick', 'Notified in advance', 'School event', 'Other'];
const INVALID_REASONS = ['No-show', 'Other'];

// One roster row. Present/Late need nothing further — the "why" (valid vs
// invalid absence, plus a reason) only appears once a student is marked
// Absent, so the common case stays a single tap and the form never shows
// remarks fields for students who just showed up normally.
const StudentAttendanceRow = ({ record, onChange }) => {
  const setStatus = (status) => {
    if (status === 'Absent') {
      onChange({ status, absenceValidity: record.absenceValidity || 'Valid' });
    } else {
      onChange({ status, absenceValidity: null, remark: '' });
    }
  };

  const reasonChips = record.absenceValidity === 'Invalid' ? INVALID_REASONS : VALID_REASONS;

  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-gray-900 dark:text-gray-100">{record.name}</span>
        <AttendanceChip status={record.status} onChange={setStatus} />
      </div>

      {record.status === 'Absent' && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex gap-2">
            {[
              { value: 'Valid', label: 'Excused' },
              { value: 'Invalid', label: 'Unexcused' },
            ].map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => onChange({ absenceValidity: v.value })}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  record.absenceValidity === v.value
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-primary-400 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {reasonChips.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ remark: r === 'Other' ? '' : r })}
                className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:border-primary-400 dark:border-gray-700 dark:text-gray-300"
              >
                {r}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={record.remark}
            onChange={(e) => onChange({ remark: e.target.value })}
            placeholder="Add a remark..."
            maxLength={300}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceRow;
