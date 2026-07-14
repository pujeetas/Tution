import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAttendanceSession, saveAttendanceSession, getErrorMessage } from '../services/api.js';

const toRow = (r) => ({
  student: r.student._id,
  name: r.student.name,
  status: r.status,
  absenceValidity: r.absenceValidity,
  remark: r.remark,
});

// Loads the attendance roster for a class+date and autosaves (debounced) on
// every change — no explicit "Submit" button, matching how a tutor actually
// works through a session in real time rather than filling out a form and
// submitting it once at the end.
const useAttendanceSession = (classId, date) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const saveTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchAttendanceSession(classId, date)
      .then((res) => {
        if (!cancelled) setRecords(res.data.session.records.map(toRow));
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(saveTimer.current);
    };
  }, [classId, date]);

  const persist = useCallback(
    (nextRecords) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        setError('');
        try {
          await saveAttendanceSession({
            classId,
            date,
            records: nextRecords.map(({ student, status, absenceValidity, remark }) => ({
              student,
              status,
              absenceValidity,
              remark,
            })),
          });
        } catch (err) {
          setError(getErrorMessage(err));
        } finally {
          setSaving(false);
        }
      }, 500);
    },
    [classId, date]
  );

  const updateRecord = (studentId, patch) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.student === studentId ? { ...r, ...patch } : r));
      persist(next);
      return next;
    });
  };

  const markAllPresent = () => {
    setRecords((prev) => {
      const next = prev.map((r) => ({ ...r, status: 'Present', absenceValidity: null, remark: '' }));
      persist(next);
      return next;
    });
  };

  return { records, loading, saving, error, updateRecord, markAllPresent };
};

export default useAttendanceSession;
