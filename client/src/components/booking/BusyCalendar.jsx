import { useState, useEffect, useMemo } from 'react';
import { fetchTutorBusyDates, getErrorMessage } from '../../services/api.js';
import { dateKey, getMonthGridDays } from '../../utils/formatDate.js';

// Read-only month calendar marking days the tutor already has bookings on.
// Purely informational — never blocks or auto-fills the booking form.
const BusyCalendar = ({ tutorId }) => {
  const [busyKeys, setBusyKeys] = useState(new Set());
  const [error, setError] = useState('');
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  useEffect(() => {
    fetchTutorBusyDates(tutorId)
      .then((res) => {
        const keys = new Set(res.data.busyDates.map((b) => dateKey(b.date)));
        setBusyKeys(keys);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [tutorId]);

  const days = useMemo(() => getMonthGridDays(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const monthLabel = cursor.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' });
  const todayKey = dateKey(today);

  const goPrev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNext = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  if (error) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="px-2 text-sm text-gray-500 hover:text-primary-600"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{monthLabel}</span>
        <button
          type="button"
          onClick={goNext}
          className="px-2 text-sm text-gray-500 hover:text-primary-600"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-gray-400">
            {d}
          </span>
        ))}
        {days.map((d) => {
          const key = dateKey(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isBusy = busyKeys.has(key);
          return (
            <span
              key={key}
              title={isBusy ? 'Has existing bookings' : undefined}
              className={`rounded py-1 ${
                !inMonth ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300'
              } ${
                isBusy ? 'bg-red-100 font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''
              } ${key === todayKey ? 'ring-1 ring-primary-500' : ''}`}
            >
              {d.getDate()}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Shaded days already have a booking — pick a different time to increase your chance of
        confirmation.
      </p>
    </div>
  );
};

export default BusyCalendar;
