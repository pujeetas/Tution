import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Button from './Button.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { getDashboardPath } from '../../utils/constants.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = getDashboardPath(user?.role);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-primary-600 dark:text-primary-400">
          TuitionHub <span className="text-red-500">SG</span>
        </Link>

        <div className="flex items-center gap-5">
          {user ? (
            <>
              <NavLink to={dashboardPath} className={linkClass}>
                Dashboard
              </NavLink>
              <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:inline">
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
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
