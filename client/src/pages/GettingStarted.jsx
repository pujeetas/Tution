import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import FieldSection from '../components/onboarding/FieldSection.jsx';
import AddedStudentsPanel from '../components/students/AddedStudentsPanel.jsx';
import AddAdminsStep from '../components/onboarding/AddAdminsStep.jsx';
import AddStaffTutorsStep from '../components/onboarding/AddStaffTutorsStep.jsx';
import AddClassesStep from '../components/onboarding/AddClassesStep.jsx';
import { completeOnboarding, saveFormConfig, getErrorMessage } from '../services/api.js';
import { getDashboardPath } from '../utils/constants.js';
import { buildDefaultFormConfig } from '../utils/formTemplates.js';

const CHECKLIST = [
  { key: 'forms', title: 'Create Registration Forms' },
  { key: 'addUsers', title: 'Add Users' },
  { key: 'classes', title: 'Create Classes' },
  { key: 'calendar', title: 'Set up Calendar' },
  { key: 'finances', title: 'Configure Finances' },
];

const FORM_TYPE_META = {
  student: { title: 'Student Form' },
  admin: { title: 'Admin Form' },
};

// Checklist position (which step is active, which are done, the admin-form
// toggle, and which Add Users sub-view) is saved per-user so that navigating
// away mid-setup — e.g. clicking "Dashboard" in the sidebar, which stays
// live throughout onboarding — and coming back doesn't reset progress to
// the very start. Deeper Form Builder editor state isn't persisted here
// since it's already recoverable from the server (user.formConfig).
const progressKey = (userId) => `onboarding-progress-${userId}`;

const loadSavedProgress = (userId) => {
  try {
    const raw = localStorage.getItem(progressKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const GettingStarted = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isCentre = user.role === 'centre';
  const saved = loadSavedProgress(user.id);

  // Which checklist item is active, and which have been completed this session
  const [step, setStep] = useState(saved?.step || 'forms'); // 'forms' | 'addUsers' | 'classes'
  const [completed, setCompleted] = useState(
    saved?.completed || { forms: false, addUsers: false, classes: false }
  );

  // Step 1: which forms this account uses at all
  const [adminForm, setAdminForm] = useState(saved?.adminForm ?? isCentre);

  // Step 1 sub-flow (via "Customise Forms"): the field-builder
  const [formsView, setFormsView] = useState('checklist'); // 'checklist' | 'formType' | 'editor'
  const [config, setConfig] = useState(() => buildDefaultFormConfig(user.formConfig));
  const [published, setPublished] = useState({
    student: Boolean(user.formConfig?.student),
    admin: Boolean(user.formConfig?.admin),
  });
  const [activeType, setActiveType] = useState('student');

  // Step 2 sub-flow: Add Users
  const [addUsersView, setAddUsersView] = useState(saved?.addUsersView || 'intro'); // 'intro' | 'students' | 'staff' | 'admins'

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      progressKey(user.id),
      JSON.stringify({ step, completed, adminForm, addUsersView })
    );
  }, [user.id, step, completed, adminForm, addUsersView]);

  const availableTypes = isCentre && adminForm ? ['student', 'admin'] : ['student'];
  const allPublished = availableTypes.every((t) => published[t]);
  const progress = Object.values(completed).filter(Boolean).length;

  const openCustomise = () => {
    setActiveType('student');
    setFormsView('formType');
  };

  const continueToEditor = () => setFormsView('editor');

  const discardChanges = () => {
    setConfig((prev) => ({ ...prev, ...buildDefaultFormConfig(user.formConfig) }));
    setFormsView('formType');
  };

  const updateSection = (section, fields) => {
    setConfig((prev) => ({
      ...prev,
      [activeType]: { ...prev[activeType], [section]: fields },
    }));
  };

  const saveAndPublish = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await saveFormConfig({ formType: activeType, sections: config[activeType] });
      updateUser(res.data.user);
      setPublished((prev) => ({ ...prev, [activeType]: true }));

      const nextUnpublished = availableTypes.find((t) => t !== activeType && !published[t]);
      setActiveType(nextUnpublished || activeType);
      setFormsView('formType');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // Finish "Create Registration Forms" and move on to "Add Users"
  const finishForms = () => {
    setCompleted((prev) => ({ ...prev, forms: true }));
    setStep('addUsers');
  };

  // Finish the whole checklist (only "Create Registration Forms" and "Add
  // Users" are real — the rest stay "Soon") and land on the dashboard
  const finish = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await completeOnboarding({ admin: adminForm });
      updateUser(res.data.user);
      localStorage.removeItem(progressKey(user.id));
      navigate(getDashboardPath(user.role));
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const finishAddUsers = () => {
    setCompleted((prev) => ({ ...prev, addUsers: true }));
    setStep('classes');
  };

  const finishClasses = () => {
    setCompleted((prev) => ({ ...prev, classes: true }));
    finish();
  };

  return (
    <div className="mx-auto max-w-5xl pt-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Welcome to your admin dashboard 🎉
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Let's complete these simple steps to get your classes up and running.
      </p>

      <div className="mt-8 grid overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-[220px_1fr]">
        {/* Checklist sidebar */}
        <div className="border-b border-gray-200 dark:border-gray-800 sm:border-b-0 sm:border-r">
          <div className="px-5 py-4">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Getting Started</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-primary-100 dark:bg-primary-900/40">
              <div
                className="h-full rounded-full bg-primary-600 transition-all"
                style={{ width: `${(progress / CHECKLIST.length) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {progress}/{CHECKLIST.length}
            </p>
          </div>
          <ul>
            {CHECKLIST.map((item) => {
              const isReal = ['forms', 'addUsers', 'classes'].includes(item.key);
              const isActive = item.key === step;
              const isDone = completed[item.key];
              return (
                <li
                  key={item.key}
                  className={`flex items-center gap-2 border-l-2 px-5 py-3 text-sm ${
                    isActive
                      ? 'border-primary-600 font-medium text-gray-900 dark:text-gray-100'
                      : isReal
                        ? 'border-transparent text-gray-500 dark:text-gray-400'
                        : 'border-transparent text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {isDone ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                      ✓
                    </span>
                  ) : (
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full border ${
                        isActive ? 'border-primary-600' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    />
                  )}
                  {item.title}
                  {!isReal && (
                    <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-300 dark:text-gray-600">
                      Soon
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Detail panel — min-w-0 lets wide content (e.g. the Students
            table) shrink to fit instead of forcing this grid column past
            its own width, which was cutting off the table's Next button */}
        <div className="min-w-0 p-6">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          {step === 'forms' && formsView === 'checklist' && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Create Registration Forms
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Set up your registration forms to collect essential information from your
                {isCentre ? ' students and admins' : ' students'}. You can customise the forms, or
                use our ready-made templates for a quick start.
              </p>

              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Student Form
                </label>
                {isCentre && (
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={adminForm}
                      onChange={(e) => setAdminForm(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Admin Form
                  </label>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={openCustomise}>
                  Customise Forms
                </Button>
                <Button onClick={finishForms}>Continue with templates</Button>
              </div>
            </>
          )}

          {step === 'forms' && formsView === 'formType' && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Select Form Type</h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Choose the type of form you want to create.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      activeType === type
                        ? 'border-primary-500 dark:border-primary-500'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {FORM_TYPE_META[type].title}
                    </p>
                    <p
                      className={`text-sm ${
                        published[type]
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {published[type] ? 'Complete' : 'Incomplete'}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setFormsView('checklist')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Back
                </button>
                <div className="flex items-center gap-3">
                  {allPublished && <Button onClick={finishForms}>Finish this step</Button>}
                  <Button variant={allPublished ? 'secondary' : 'primary'} onClick={continueToEditor}>
                    Continue
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 'forms' && formsView === 'editor' && activeType === 'student' && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Student Registration Form
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Add and customise fields for the Student Registration Form.
              </p>

              <div className="mt-4 space-y-4">
                <FieldSection
                  title="Student Details Section"
                  fields={config.student.studentDetails}
                  onChange={(fields) => updateSection('studentDetails', fields)}
                />
                <FieldSection
                  title="Parent Details Section"
                  fields={config.student.parentDetails}
                  onChange={(fields) => updateSection('parentDetails', fields)}
                  includeToggle={{
                    checked: config.student.parentSection,
                    onChange: (e) =>
                      setConfig((prev) => ({
                        ...prev,
                        student: { ...prev.student, parentSection: e.target.checked },
                      })),
                  }}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={discardChanges}>
                  Discard Changes
                </Button>
                <Button onClick={saveAndPublish} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save and Publish Form'}
                </Button>
              </div>
            </>
          )}

          {step === 'forms' && formsView === 'editor' && activeType === 'admin' && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Admin Registration Form
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Add and customise fields for the Admin Registration Form.
              </p>

              <div className="mt-4">
                <FieldSection
                  title="Personal Details Section"
                  fields={config.admin.adminDetails}
                  onChange={(fields) => updateSection('adminDetails', fields)}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={discardChanges}>
                  Discard Changes
                </Button>
                <Button onClick={saveAndPublish} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save and Publish Form'}
                </Button>
              </div>
            </>
          )}

          {step === 'addUsers' && addUsersView === 'intro' && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Add Users</h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Add profiles for your{isCentre ? ' students, staff tutors' : ' students'}
                {isCentre && adminForm ? ' and admins' : ''}. Populate the necessary details to
                ensure proper record-keeping and communication.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAddUsersView('students')}
                  className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500"
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Add Students</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add student profiles and their parent accounts.
                  </p>
                </button>
                {isCentre && (
                  <button
                    type="button"
                    onClick={() => setAddUsersView('staff')}
                    className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500"
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Add Staff Tutors</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add tutors to your team so you can assign them to classes.
                    </p>
                  </button>
                )}
                {isCentre && adminForm && (
                  <button
                    type="button"
                    onClick={() => setAddUsersView('admins')}
                    className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500"
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Add Admins</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add other admins to help manage your organization.
                    </p>
                  </button>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={finishAddUsers}
                  disabled={submitting}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {submitting ? 'Saving...' : 'Skip for now'}
                </button>
              </div>
            </>
          )}

          {step === 'addUsers' && addUsersView === 'students' && (
            <>
              <AddedStudentsPanel />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddUsersView('intro')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Back
                </button>
                <Button className="ml-auto" onClick={finishAddUsers} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Continue'}
                </Button>
              </div>
            </>
          )}

          {step === 'addUsers' && addUsersView === 'staff' && (
            <>
              <AddStaffTutorsStep />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddUsersView('intro')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Back
                </button>
                <Button className="ml-auto" onClick={finishAddUsers} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Continue'}
                </Button>
              </div>
            </>
          )}

          {step === 'addUsers' && addUsersView === 'admins' && (
            <>
              <AddAdminsStep />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddUsersView('intro')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Back
                </button>
                <Button className="ml-auto" onClick={finishAddUsers} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Continue'}
                </Button>
              </div>
            </>
          )}

          {step === 'classes' && (
            <>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Create Classes</h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Set up your first class — assign tutors and students, and set a weekly schedule.
                You can always add more later from the sidebar.
              </p>
              <div className="mt-4">
                <AddClassesStep />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button className="ml-auto" onClick={finishClasses} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Go to Dashboard'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
