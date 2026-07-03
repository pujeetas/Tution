import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth.js';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TutorList from './pages/TutorList.jsx';
import TutorProfile from './pages/TutorProfile.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ParentDashboardPage from './pages/ParentDashboardPage.jsx';
import TutorDashboardPage from './pages/TutorDashboardPage.jsx';

// Route guard: requires login (and optionally a specific role)
const ProtectedRoute = ({ children, role }) => {
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
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/parent'}
        replace
      />
    );
  }
  return children;
};

const App = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Routes>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
