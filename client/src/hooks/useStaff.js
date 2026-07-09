import { useState, useEffect, useCallback } from 'react';
import { fetchMyStaff, getErrorMessage } from '../services/api.js';

// Fetch the centre's staff tutor roster
const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchMyStaff();
      setStaff(res.data.staff);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { staff, loading, error, refetch: load };
};

export default useStaff;
