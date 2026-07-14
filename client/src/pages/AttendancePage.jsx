import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import StudentAttendanceRow from '../components/attendance/StudentAttendanceRow.jsx';
import useAttendanceSession from '../hooks/useAttendanceSession.js';
import useAttendanceSessions from '../hooks/useAttendanceSessions.js';
import { fetchClassById, getErrorMessage } from '../services/api.js';

const todayStr = () => new Date().toISOString().slice(0, 10);

const shiftDate = (dateStr, days) => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// "Mark Attendance" for one class — a date switcher over a roster of
// single-tap status chips, autosaving as you go, with a past-sessions
// browser underneath. See AttendanceChip/StudentAttendanceRow for the
// per-row interaction.
const AttendancePage = () => {
  const { id } = useParams();
  const [date, setDate] = useState(todayStr());
  const [klass, setKlass] = useState(null);
  const [classError, setClassError] = useState('');

  useEffect(() => {
    fetchClassById(id)
      .then((res) => setKlass(res.data.class))
      .catch((err) => setClassError(getErrorMessage(err)));
  }, [id]);

  const { records, loading, saving, error, updateRecord, markAllPresent } = useAttendanceSession(id, date);
  const { sessions, refetch: refetchSessions } = useAttendanceSessions(id);

  useEffect(() => {
    if (!saving) refetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving]);

  const presentCount = records.filter((r) => r.status === 'Present').length;

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/dashboard/classes"
          className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Back to Classes
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {klass ? klass.name : 'Class'} — Attendance
        </h1>
        {klass && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {klass.schedule?.dayOfWeek
              ? `${klass.schedule.dayOfWeek} ${klass.schedule.startTime}-${klass.schedule.endTime}`
              : 'No recurring schedule'}
            {' · '}
            {records.length} student{records.length === 1 ? '' : 's'}
          </p>
        )}
        {classError && <p className="text-sm text-red-600 dark:text-red-400">{classError}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <Button type="button" variant="secondary" onClick={() => setDate((d) => shiftDate(d, -1))}>
          ← Prev
        </Button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <Button type="button" variant="secondary" onClick={() => setDate((d) => shiftDate(d, 1))}>
          Next →
        </Button>
        <Button type="button" variant="secondary" onClick={() => setDate(todayStr())}>
          Today
        </Button>
        <Button type="button" className="ml-auto" onClick={markAllPresent} disabled={records.length === 0}>
          Mark All Present
        </Button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {presentCount}/{records.length} present
        {saving ? ' · Saving...' : !loading ? ' · Saved' : ''}
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <LoadingSpinner message="Loading roster..." />
      ) : records.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No students assigned to this class yet.
        </p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <StudentAttendanceRow key={r.student} record={r} onChange={(patch) => updateRecord(r.student, patch)} />
          ))}
        </div>
      )}

      {sessions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Past Sessions
          </h3>
          <div className="space-y-1">
            {sessions.map((s) => {
              const present = s.records.filter((r) => r.status === 'Present').length;
              const absent = s.records.filter((r) => r.status === 'Absent').length;
              return (
                <button
                  key={s.date}
                  type="button"
                  onClick={() => setDate(s.date)}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left text-sm transition-colors ${
                    s.date === date
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                  }`}
                >
                  <span className="text-gray-700 dark:text-gray-300">{s.date}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {present} present{absent > 0 ? `, ${absent} absent` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
