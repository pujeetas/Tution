import { useState, useEffect, useCallback } from 'react';
import { fetchAddedStudents, getErrorMessage } from '../services/api.js';

// Fetch the tutor/centre's added students, filtered and paginated by `filters`
// ({ search, level, status, page, limit }). Refetches whenever filters change.
const useAddedStudents = (filters) => {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filtersKey = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAddedStudents(filters);
      setStudents(res.data.students);
      setMeta({ total: res.data.total, page: res.data.page, pages: res.data.pages });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { students, meta, loading, error, refetch: load };
};

export default useAddedStudents;
