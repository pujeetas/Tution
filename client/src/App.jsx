import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth.js';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import { getDashboardPath } from './utils/constants.js';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import GettingStarted from './pages/GettingStarted.jsx';
import TutorList from './pages/TutorList.jsx';
import TutorProfile from './pages/TutorProfile.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ParentDashboardPage from './pages/ParentDashboardPage.jsx';
import TutorDashboardPage from './pages/TutorDashboardPage.jsx';
import CentreDashboardPage from './pages/CentreDashboardPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import AdminsPage from './pages/AdminsPage.jsx';

// Route guard: requires login (and optionally a specific role or list of roles)
const ProtectedRoute = ({ children, role, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  const allowedRoles = roles || (role ? [role] : null);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return children;
};

const App = () => (
  <Routes>
    {/* Public / pre-dashboard pages — top Navbar */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/tutors"
        element={
          <ProtectedRoute>
            <TutorList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutors/:id"
        element={
          <ProtectedRoute>
            <TutorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:tutorId"
        element={
          <ProtectedRoute role="parent">
            <BookingPage />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Authenticated dashboard pages — Sidebar nav */}
    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute roles={['tutor', 'centre']}>
            <GettingStarted />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/parent"
        element={
          <ProtectedRoute role="parent">
            <ParentDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tutor"
        element={
          <ProtectedRoute role="tutor">
            <TutorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/centre"
        element={
          <ProtectedRoute role="centre">
            <CentreDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/students"
        element={
          <ProtectedRoute roles={['tutor', 'centre']}>
            <StudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admins"
        element={
          <ProtectedRoute role="centre">
            <AdminsPage />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
