import { useState, useEffect, useCallback } from 'react';
import { fetchTutors, getErrorMessage } from '../services/api.js';

// Fetch the tutor list whenever filters change
const useTutors = (filters) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchTutors(filters);
      setTutors(res.data.tutors);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return { tutors, loading, error, refetch: load };
};

export default useTutors;
