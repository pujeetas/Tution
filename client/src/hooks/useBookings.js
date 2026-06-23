import { useState, useEffect, useCallback } from 'react';
import {
  fetchMyBookings,
  updateBookingStatus,
  getErrorMessage,
} from '../services/api.js';

// Load the current user's bookings and allow status changes
const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchMyBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    const res = await updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b._id === id ? res.data.booking : b)));
  };

  return { bookings, loading, error, refetch: load, setStatus };
};

export default useBookings;
