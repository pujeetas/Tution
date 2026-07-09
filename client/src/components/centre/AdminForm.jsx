import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { createOrgAdmin, getErrorMessage } from '../../services/api.js';

const EMPTY_FORM = { name: '', email: '', password: '', phone: '' };

// Form for a centre admin to add another admin account to the organization
const AdminForm = ({ onCreated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setSaving(true);
    try {
      const res = await createOrgAdmin(form);
      setSuccess(`${res.data.admin.name} was added as an admin`);
      setForm(EMPTY_FORM);
      onCreated?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="name" required value={form.name} onChange={handleChange} />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <Input
          label="Initial password"
          name="password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
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
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Adding admin...' : 'Add Admin'}
      </Button>
    </form>
  );
};

export default AdminForm;
