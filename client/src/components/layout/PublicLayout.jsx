import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../common/Footer.jsx';

// Shell for the marketing/pre-dashboard pages (Landing, Login, Register, and
// the public tutor browse/booking pages) — top Navbar instead of the
// dashboard Sidebar.
const PublicLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
