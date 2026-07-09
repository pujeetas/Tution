// Default field catalog for the registration Form Builder, matching the Figma's
// Student/Admin Registration Form field lists. `locked` fields are always
// included and required (can't be removed or made optional).
const STUDENT_DETAILS = [
  { key: 'fullName', label: 'Full Name', locked: true },
  { key: 'dob', label: 'Date of Birth (DD/MM/YYYY)', locked: true },
  { key: 'phone', label: 'Phone Number', locked: true },
  { key: 'email', label: 'Email Address', locked: true },
  { key: 'gender', label: 'Gender', locked: false },
  { key: 'nric', label: 'NRIC (Last 4 Digits)', locked: false },
  { key: 'homeAddress', label: 'Home Address', locked: false },
  { key: 'postalCode', label: 'Postal Code', locked: false },
  { key: 'level', label: 'Level', locked: false },
  { key: 'schoolName', label: 'School Name', locked: false },
];

const PARENT_DETAILS = [
  { key: 'fullName', label: 'Full Name', locked: true },
  { key: 'dob', label: 'Date of Birth (DD/MM/YYYY)', locked: true },
  { key: 'phone', label: 'Phone Number', locked: true },
  { key: 'email', label: 'Email Address', locked: true },
  { key: 'gender', label: 'Gender', locked: false },
  { key: 'nric', label: 'NRIC (Last 4 Digits)', locked: false },
  { key: 'homeAddress', label: 'Home Address', locked: false },
  { key: 'postalCode', label: 'Postal Code', locked: false },
];

const ADMIN_DETAILS = [
  { key: 'fullName', label: 'Full Name', locked: true },
  { key: 'dob', label: 'Date of Birth (DD/MM/YYYY)', locked: true },
  { key: 'phone', label: 'Phone Number', locked: true },
  { key: 'email', label: 'Email Address', locked: true },
  { key: 'gender', label: 'Gender', locked: false },
  { key: 'nric', label: 'NRIC (Last 4 Digits)', locked: false },
  { key: 'homeAddress', label: 'Home Address', locked: false },
  { key: 'postalCode', label: 'Postal Code', locked: false },
];

const toFieldState = (fields) =>
  fields.map((f) => ({ ...f, required: f.locked, included: true }));

// Builds a fresh default config, optionally seeded from a previously-saved one.
export const buildDefaultFormConfig = (saved) => ({
  student: {
    parentSection: saved?.student?.parentSection ?? true,
    studentDetails: saved?.student?.studentDetails || toFieldState(STUDENT_DETAILS),
    parentDetails: saved?.student?.parentDetails || toFieldState(PARENT_DETAILS),
  },
  admin: {
    adminDetails: saved?.admin?.adminDetails || toFieldState(ADMIN_DETAILS),
  },
});
