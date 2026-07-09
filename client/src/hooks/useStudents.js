import { useState, useEffect, useCallback } from 'react';
import {
  fetchMyStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getErrorMessage,
} from '../services/api.js';

// Fetch and manage the parent's own students
const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchMyStudents();
      setStudents(res.data.students);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addStudent = async (data) => {
    const res = await createStudent(data);
    setStudents((prev) => [res.data.student, ...prev]);
    return res.data.student;
  };

  const editStudent = async (id, data) => {
    const res = await updateStudent(id, data);
    setStudents((prev) => prev.map((s) => (s._id === id ? res.data.student : s)));
  };

  const removeStudent = async (id) => {
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s._id !== id));
  };

  return { students, loading, error, refetch: load, addStudent, editStudent, removeStudent };
};

export default useStudents;
