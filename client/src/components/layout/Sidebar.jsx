import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getDashboardPath } from '../../utils/constants.js';
import {
  IconDashboard,
  IconAnalytics,
  IconRegistration,
  IconCalendar,
  IconClasses,
  IconFinances,
  IconAnnouncement,
  IconMessage,
  IconOrganisation,
  IconRoles,
  IconUsers,
  IconReports,
  IconSettings,
  IconSignOut,
} from './icons.jsx';

// Nav structure mirrors the Uniad Enterprise Figma's primary IA (see
// docs/figma-spec/README.md "Primary nav / IA"). Unbuilt items are kept
// visible but disabled ("Soon") so the information architecture is honest
// about what's coming rather than hidden or faked. The Figma's "Education
// Tools" group (Resources Library, Online Courses, Staff Training, AI
// Tutors) is deliberately omitted — it borders the course-marketplace
// surface that's explicitly out of scope.
const ADMIN_NAV = [
  {
    items: [
      { label: 'Analytics', Icon: IconAnalytics },
      { label: 'Registration', Icon: IconRegistration },
      { label: 'Calendar', Icon: IconCalendar },
      { label: 'Finances', Icon: IconFinances },
    ],
  },
  {
    group: 'Communication',
    items: [
      { label: 'Announcements', Icon: IconAnnouncement },
      { label: 'Messages', Icon: IconMessage },
    ],
  },
  {
    group: 'Manage Database',
    items: [
      { label: 'Organisation', Icon: IconOrganisation },
      { label: 'Roles & Access Control', Icon: IconRoles },
      { label: 'Students', Icon: IconUsers, to: '/dashboard/students' },
      { label: 'Admins', Icon: IconUsers, to: '/dashboard/admins', centreOnly: true },
      { label: 'Lessons', Icon: IconClasses },
      { label: 'Reports', Icon: IconReports },
    ],
  },
];

const navLinkClass = ({ isActive }) =>
  `mx-0 flex items-center gap-3 px-5 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-primary-600 text-white'
      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
  }`;

const SoonItem = ({ label, Icon }) => (
  <div className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-300 dark:text-gray-600">
    <Icon className="h-5 w-5 shrink-0" />
    <span className="truncate">{label}</span>
    <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-300 dark:text-gray-600">
      Soon
    </span>
  </div>
);

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
        <NavLink to={getDashboardPath(user.role)} end className={navLinkClass}>
          <IconDashboard className="h-5 w-5 shrink-0" />
          Dashboard
        </NavLink>

        {isAdmin &&
          ADMIN_NAV.map(({ group, items }, i) => (
            <div key={group || i} className="mt-1">
              {group && (
                <p className="px-5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {group}
                </p>
              )}
              {items
                .filter((item) => !item.centreOnly || user.role === 'centre')
                .map(({ label, Icon, to }) =>
                  to ? (
                    <NavLink key={label} to={to} className={navLinkClass}>
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </NavLink>
                  ) : (
                    <SoonItem key={label} label={label} Icon={Icon} />
                  )
                )}
            </div>
          ))}

        <div className="mt-auto border-t border-gray-100 pt-2 dark:border-gray-800">
          <SoonItem label="Settings" Icon={IconSettings} />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
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
