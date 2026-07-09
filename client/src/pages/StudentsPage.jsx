import AddedStudentsPanel from '../components/students/AddedStudentsPanel.jsx';

// Sidebar "Manage Database → Students" page for tutors/centres.
const StudentsPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Students</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Manage the students you've added and their parent accounts.
      </p>
    </div>
    <AddedStudentsPanel />
  </div>
);

export default StudentsPage;
