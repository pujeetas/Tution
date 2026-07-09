// Minimal inline stroke icons for the dashboard Sidebar — no icon package
// dependency for a handful of glyphs.
const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.75,
  stroke: 'currentColor',
};

export const IconDashboard = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6l8-3 8 3-8 3-8-3zm0 6l8 3 8-3M4 12v6l8 3 8-3v-6"
    />
  </svg>
);

export const IconRegistration = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h9a2 2 0 002-2v-6M13 4h5v5M18 4l-8 8"
    />
  </svg>
);

export const IconCalendar = (props) => (
  <svg {...base} {...props}>
    <rect x="4" y="5" width="16" height="15" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9.5h16M8 3v3M16 3v3" />
  </svg>
);

export const IconClasses = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5.5S6 4 9 4s5 1.5 5 1.5v13S12 17 9 17s-5 1.5-5 1.5v-13zM14 5.5S16 4 19 4s1 1.5 1 1.5v13S18 17 15 17s-1 1.5-1 1.5"
    />
  </svg>
);

export const IconFinances = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="6" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
  </svg>
);

export const IconSettings = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.4 13.5a7.97 7.97 0 000-3l2-1.4-2-3.4-2.3.9a8 8 0 00-2.6-1.5L14 2h-4l-.5 2.6a8 8 0 00-2.6 1.5l-2.3-.9-2 3.4 2 1.4a8 8 0 000 3l-2 1.4 2 3.4 2.3-.9c.77.65 1.65 1.16 2.6 1.5L10 22h4l.5-2.6a8 8 0 002.6-1.5l2.3.9 2-3.4-2-1.4z"
    />
  </svg>
);

export const IconAnalytics = (props) => (
  <svg {...base} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M10 20V4M16 20v-8M20 20H4" />
  </svg>
);

export const IconAnnouncement = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 4L5 9v4l14 5V4zM5 13v4a2 2 0 004 0v-3M19 9a3 3 0 010 4"
    />
  </svg>
);

export const IconMessage = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z"
    />
  </svg>
);

export const IconOrganisation = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 20V6a2 2 0 012-2h8a2 2 0 012 2v14M4 20h16M16 10h3a1 1 0 011 1v9M8 8h2M8 12h2M8 16h2M12 8h2M12 12h2M12 16h2"
    />
  </svg>
);

export const IconRoles = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3zM9.5 12l2 2 3.5-4"
    />
  </svg>
);

export const IconUsers = (props) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8" r="3.25" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.5 20a5.5 5.5 0 0111 0M15.5 5.5a3.25 3.25 0 010 5.5M17 14.6A5.51 5.51 0 0120.5 20"
    />
  </svg>
);

export const IconReports = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6"
    />
  </svg>
);

export const IconSignOut = (props) => (
  <svg {...base} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 15l4-3-4-3M20 12H9"
    />
  </svg>
);
