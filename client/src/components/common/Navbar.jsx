import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Button from './Button.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/parent';

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-primary-600">
          TuitionHub <span className="text-red-500">SG</span>
        </Link>

        <div className="flex items-center gap-5">
          <NavLink to="/tutors" className={linkClass}>
            Find Tutors
          </NavLink>

          {user ? (
            <>
              <NavLink to={dashboardPath} className={linkClass}>
                Dashboard
              </NavLink>
              <span className="hidden text-sm text-gray-500 sm:inline">
                Hi, {user.name.split(' ')[0]}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
