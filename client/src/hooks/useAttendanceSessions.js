import { useState, useEffect, useCallback } from 'react';
import { fetchAttendanceSessions, getErrorMessage } from '../services/api.js';

// Past attendance sessions for a class, most recent first — used for the
// prev-session browser / history list under the roster editor.
const useAttendanceSessions = (classId) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAttendanceSessions(classId);
      setSessions(res.data.sessions);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    load();
  }, [load]);

  return { sessions, loading, error, refetch: load };
};

export default useAttendanceSessions;
