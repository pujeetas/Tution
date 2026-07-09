import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { getErrorMessage } from '../services/api.js';
import { ROLES, getPostAuthPath } from '../utils/constants.js';

const ROLE_OPTIONS = [
  {
    value: 'parent',
    title: 'Parent',
    desc: 'Book and pay for tuition sessions for your child.',
  },
  {
    value: 'tutor',
    title: 'Individual tutor',
    desc: 'Manage your own students, schedule and invoicing.',
  },
  {
    value: 'centre',
    title: 'Tuition centre',
    desc: 'Run a team of tutors and staff under one organisation.',
  },
];

const STEP_META = {
  account: { title: 'Create your login', label: 'Account' },
  role: { title: 'What describes you best?', label: 'Account type' },
  profile: { title: "Let's set up your profile", label: 'Profile' },
  organization: { title: 'Set up your organisation', label: 'Organisation' },
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = ROLES.includes(searchParams.get('role')) ? searchParams.get('role') : '';

  const [stepIndex, setStepIndex] = useState(0);
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
    name: '',
    dob: '',
    phone: '',
    organizationName: '',
    registrationNo: '',
    orgPhone: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const steps = useMemo(
    () =>
      role === 'centre'
        ? ['account', 'role', 'profile', 'organization']
        : ['account', 'role', 'profile'],
    [role]
  );
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateStep = () => {
    if (step === 'account') {
      if (!form.email || !form.password) return 'Email and password are required';
      if (form.password.length < 6) return 'Password must be at least 6 characters';
      if (form.password !== form.confirmPassword) return 'Passwords do not match';
      if (!form.agree) return 'Please agree to the Terms & Conditions to continue';
    }
    if (step === 'role') {
      if (!role) return 'Please choose an account type to continue';
    }
    if (step === 'profile') {
      if (!form.name || !form.dob || !form.phone) {
        return 'Name, date of birth and phone number are required';
      }
    }
    if (step === 'organization') {
      if (!form.organizationName || !form.orgPhone) {
        return 'Organisation name and phone number are required';
      }
    }
    return '';
  };

  const goNext = () => {
    const err = validateStep();
    if (err) return setError(err);
    setError('');
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    setError('');
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) return setError(err);

    setError('');
    setSubmitting(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone,
        dob: form.dob,
        organizationName: form.organizationName,
        registrationNo: form.registrationNo,
        orgPhone: form.orgPhone,
      });
      navigate(getPostAuthPath(user));
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Step progress */}
        <div className="mb-6 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
          Step {stepIndex + 1} of {steps.length} · {STEP_META[step].label}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {STEP_META[step].title}
        </h1>

        <form
          onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()}
          className="mt-6 space-y-4"
        >
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          {step === 'account' && (
            <>
              <Input
                label="Email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />
              <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700"
                />
                I agree to the Terms &amp; Conditions
              </label>
            </>
          )}

          {step === 'role' && (
            <div className="grid gap-3">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    role === opt.value
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{opt.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 'profile' && (
            <>
              <Input
                label="Full name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Tan Wei Ming"
              />
              <Input
                label="Date of birth"
                name="dob"
                type="date"
                required
                value={form.dob}
                onChange={handleChange}
              />
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+65 9123 4567"
              />
            </>
          )}

          {step === 'organization' && (
            <>
              <Input
                label="Organisation name"
                name="organizationName"
                required
                value={form.organizationName}
                onChange={handleChange}
                placeholder="e.g. Bright Minds Tuition Centre"
              />
              <Input
                label="Registration No. (UEN)"
                name="registrationNo"
                value={form.registrationNo}
                onChange={handleChange}
                placeholder="Optional"
              />
              <Input
                label="Organisation phone number"
                name="orgPhone"
                type="tel"
                required
                value={form.orgPhone}
                onChange={handleChange}
                placeholder="+65 6123 4567"
              />
            </>
          )}

          <div className="flex items-center gap-3 pt-2">
            {stepIndex > 0 && (
              <Button type="button" variant="secondary" onClick={goBack} className="flex-1">
                Back
              </Button>
            )}
            {isLastStep ? (
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? 'Creating account...' : 'Create account'}
              </Button>
            ) : (
              <Button type="button" onClick={goNext} className="flex-1">
                Continue
              </Button>
            )}
          </div>
        </form>

        {stepIndex === 0 && (
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
