import { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { fetchMyOrganization, saveMyOrganization, getErrorMessage } from '../../services/api.js';

// Editable card for the centre's own organization profile
const CentreInfo = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', registrationNo: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyOrganization()
      .then((res) => {
        setOrganization(res.data.organization);
        setForm({
          name: res.data.organization?.name || '',
          registrationNo: res.data.organization?.registrationNo || '',
          phone: res.data.organization?.phone || '',
        });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await saveMyOrganization(form);
      setOrganization(res.data.organization);
      setSuccess('Organization details saved');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading organization..." />;

  return (
    <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        Organization Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Input
          label="Organization name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="Registration No. (UEN)"
          name="registrationNo"
          value={form.registrationNo}
          onChange={handleChange}
          placeholder="Optional"
        />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
        />
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Details'}
        </Button>
      </form>
    </div>
  );
};

export default CentreInfo;
