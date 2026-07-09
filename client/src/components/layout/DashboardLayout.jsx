import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Footer from '../common/Footer.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import useAuth from '../../hooks/useAuth.js';

// Shell for authenticated tutor/parent/centre pages — left Sidebar nav +
// content column, matching the Figma's dashboard chrome (distinct from the
// lightweight top-nav used on the public/marketing pages).
const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{user.role}</p>
          </div>
          <ThemeToggle />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
