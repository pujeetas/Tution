import { useState, useEffect, useCallback } from 'react';
import { fetchOrgAdmins, getErrorMessage } from '../services/api.js';

// Fetch the centre's admin roster, filtered and paginated by `filters`
// ({ search, page, limit }). Refetches whenever filters change.
const useOrgAdmins = (filters) => {
  const [admins, setAdmins] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filtersKey = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchOrgAdmins(filters);
      setAdmins(res.data.admins);
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

  return { admins, meta, loading, error, refetch: load };
};

export default useOrgAdmins;
