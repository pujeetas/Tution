export const SUBJECTS = [
  'Math',
  'English',
  'Science',
  'Chinese',
  'Malay',
  'Tamil',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Geography',
];

export const LEVELS = ['PSLE', 'O-Levels', 'A-Levels'];

export const CHILD_LEVELS = ['Primary', 'Secondary', 'JC'];

export const ROLES = ['parent', 'tutor', 'centre'];

export const DASHBOARD_PATHS = {
  parent: '/dashboard/parent',
  tutor: '/dashboard/tutor',
  centre: '/dashboard/centre',
};

export const getDashboardPath = (role) => DASHBOARD_PATHS[role] || '/dashboard/parent';

// Where to send a user right after login/register — the one-time "Getting
// Started" step for tutors/centres that haven't completed it yet, otherwise
// their normal dashboard.
export const getPostAuthPath = (user) => {
  if (['tutor', 'centre'].includes(user.role) && !user.onboardingComplete) {
    return '/onboarding';
  }
  return getDashboardPath(user.role);
};

export const TEACHING_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In-person' },
  { value: 'both', label: 'Online & In-person' },
];

export const SESSION_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In-person' },
];

export const DURATIONS = [
  { value: 1, label: '1 hour' },
  { value: 1.5, label: '1.5 hours' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
];

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export const PAYMENT_STATUS_COLORS = {
  unpaid: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};
