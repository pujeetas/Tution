import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { getErrorMessage } from '../services/api.js';
import { CHILD_LEVELS } from '../utils/constants.js';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(
    searchParams.get('role') === 'tutor' ? 'tutor' : 'parent'
  );
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    childName: '',
    childLevel: 'Primary',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setSubmitting(true);
    try {
      const user = await register({ ...form, role });
      navigate(user.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/parent');
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Join TuitionHub SG today</p>

        {/* Role toggle */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {[
            ['parent', "I'm a Parent"],
            ['tutor', "I'm a Tutor"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                role === value
                  ? 'bg-white text-primary-600 shadow dark:bg-gray-700 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <Input
            label="Full name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Tan Wei Ming"
          />
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

          {role === 'tutor' ? (
            <Input
              label="Phone number"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+65 9123 4567"
            />
          ) : (
            <>
              <Input
                label="Child's name"
                name="childName"
                required
                value={form.childName}
                onChange={handleChange}
                placeholder="e.g. Ethan"
              />
              <Input
                as="select"
                label="Child's level"
                name="childLevel"
                value={form.childLevel}
                onChange={handleChange}
              >
                {CHILD_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Input>
            </>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
