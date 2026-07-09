import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getDashboardPath } from '../../utils/constants.js';
import {
  IconDashboard,
  IconRegistration,
  IconCalendar,
  IconClasses,
  IconFinances,
  IconSettings,
  IconSignOut,
} from './icons.jsx';

// Items only meaningful for accounts that run a tuition operation (tutor/centre).
// Not yet built — kept visible but disabled so the real information architecture
// is honest about what's coming rather than hidden or faked.
const ADMIN_SOON_ITEMS = [
  { label: 'Registration', Icon: IconRegistration },
  { label: 'Calendar', Icon: IconCalendar },
  { label: 'Classes', Icon: IconClasses },
  { label: 'Finances', Icon: IconFinances },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user.role === 'tutor' || user.role === 'centre';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2.5 bg-gray-900 px-5 py-5">
        <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-primary-500" fill="currentColor">
          <path d="M12 3L1 8l11 5 9-4.09V17h2V8L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
        <span className="text-lg font-bold text-white">
          TuitionHub <span className="text-primary-500">SG</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto py-3">
        <NavLink
          to={getDashboardPath(user.role)}
          className={({ isActive }) =>
            `mx-0 flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            }`
          }
        >
          <IconDashboard className="h-5 w-5 shrink-0" />
          Dashboard
        </NavLink>

        {isAdmin && (
          <div className="mt-2">
            {ADMIN_SOON_ITEMS.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-300 dark:text-gray-600"
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
                <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-300 dark:text-gray-600">
                  Soon
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto border-t border-gray-100 pt-2 dark:border-gray-800">
          <div className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-300 dark:text-gray-600">
            <IconSettings className="h-5 w-5 shrink-0" />
            Settings
            <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-300 dark:text-gray-600">
              Soon
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <IconSignOut className="h-5 w-5 shrink-0" />
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
