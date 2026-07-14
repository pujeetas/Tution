import { useState, useEffect, useCallback } from 'react';
import { fetchClasses, getErrorMessage } from '../services/api.js';

// Fetch this tutor/centre's classes, filtered and paginated by `filters`
// ({ search, level, subject, status, page, limit }). Refetches whenever filters change.
const useClasses = (filters) => {
  const [classes, setClasses] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filtersKey = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchClasses(filters);
      setClasses(res.data.classes);
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

  return { classes, meta, loading, error, refetch: load };
};

export default useClasses;
