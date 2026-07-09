import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const completeOnboarding = (data) => api.patch('/auth/onboarding', data);
export const saveFormConfig = (data) => api.patch('/auth/form-config', data);

// ---- Tutors ----
export const fetchTutors = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  );
  return api.get('/tutors', { params });
};
export const fetchTutorById = (id) => api.get(`/tutors/${id}`);
export const fetchTutorBusyDates = (id) => api.get(`/tutors/${id}/busy-dates`);
export const fetchTutorOptions = () => api.get('/tutors/meta/options');
export const fetchMyTutorProfile = () => api.get('/tutors/me/profile');
export const saveMyTutorProfile = (data) => api.put('/tutors/me/profile', data);

// ---- Bookings ----
export const createBooking = (data) => api.post('/bookings', data);
export const fetchMyBookings = () => api.get('/bookings/me');
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });
export const payForBooking = (id) => api.patch(`/bookings/${id}/pay`);

// ---- Organizations ----
export const fetchMyOrganization = () => api.get('/organizations/me');
export const saveMyOrganization = (data) => api.patch('/organizations/me', data);
export const fetchMyStaff = () => api.get('/organizations/me/staff');
export const createStaffTutor = (data) => api.post('/organizations/staff', data);
export const fetchStaffOptions = () => api.get('/organizations/meta/options');
export const fetchOrgAdmins = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  );
  return api.get('/organizations/admins', { params });
};
export const createOrgAdmin = (data) => api.post('/organizations/admins', data);
export const bulkDeleteAdmins = (ids) => api.post('/organizations/admins/bulk-delete', { ids });

// ---- Students ----
export const fetchMyStudents = () => api.get('/students/me');
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.patch(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ---- Students added by a tutor/centre on a parent's behalf ----
export const fetchAddedStudents = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v != null)
  );
  return api.get('/students/added', { params });
};
export const addStudentForParent = (data) => api.post('/students/add-for-parent', data);
export const bulkDeleteStudents = (ids) => api.post('/students/bulk-delete', { ids });

// Extract a readable message from an axios error
export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';

export default api;
