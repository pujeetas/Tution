import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { addStudentForParent, updateAddedStudent, getErrorMessage } from '../../services/api.js';
import { CHILD_LEVELS, STUDENT_GENDERS } from '../../utils/constants.js';

const EMPTY_FORM = {
  studentName: '',
  dob: '',
  phone: '',
  email: '',
  gender: '',
  homeAddress: '',
  postalCode: '',
  level: 'Primary',
  schoolName: '',
  parentName: '',
  parentDob: '',
  parentEmail: '',
  parentPhone: '',
  parentPassword: '',
};

const formFromStudent = (s) =>
  s
    ? {
        ...EMPTY_FORM,
        studentName: s.name || '',
        dob: s.dob ? s.dob.slice(0, 10) : '',
        phone: s.phone || '',
        email: s.email || '',
        gender: s.gender || '',
        homeAddress: s.homeAddress || '',
        postalCode: s.postalCode || '',
        level: s.level || 'Primary',
        schoolName: s.schoolName || '',
      }
    : EMPTY_FORM;

// Shared by AddedStudentsPanel's inline "Add Students" panel and its edit
// modal. Pass `studentToEdit` to switch into edit mode — the Parent Details
// section hides (editing a student's own details shouldn't re-collect or
// relink their parent account) and submit goes through updateAddedStudent
// instead of addStudentForParent.
const StudentForm = ({ studentToEdit, onSaved }) => {
  const isEdit = Boolean(studentToEdit);
  const [form, setForm] = useState(() => formFromStudent(studentToEdit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!form.studentName.trim()) return setError('Student name is required');
    if (!isEdit && !form.parentEmail.trim()) return setError('Parent email is required');

    setSaving(true);
    try {
      if (isEdit) {
        const res = await updateAddedStudent(studentToEdit._id, form);
        setNotice(`${res.data.student.name} was updated`);
        onSaved?.(res.data.student);
      } else {
        const res = await addStudentForParent(form);
        setNotice(
          res.data.createdNewParent
            ? `Added ${form.studentName} and created a new parent account for ${res.data.parent.email}.`
            : `Added ${form.studentName} and linked to the existing parent account for ${res.data.parent.email}.`
        );
        setForm(EMPTY_FORM);
        onSaved?.(res.data.student);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEdit && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If the parent's email already has an account, the student is linked to it. Otherwise we
          create a new parent account with the password you set here.
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {notice}
        </p>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Student Details
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="e.g. Ethan Tan"
          />
          <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 8770 3325"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. student@example.com"
          />
          <Input as="select" label="Gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            {STUDENT_GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Input>
          <Input as="select" label="Level" name="level" value={form.level} onChange={handleChange}>
            {CHILD_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Input>
          <Input
            label="Home Address"
            name="homeAddress"
            value={form.homeAddress}
            onChange={handleChange}
            placeholder="e.g. 12 Mount Elizabeth"
          />
          <Input
            label="Postal Code"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="e.g. 231851"
          />
          <Input
            label="School Name"
            name="schoolName"
            value={form.schoolName}
            onChange={handleChange}
            placeholder="e.g. Uniad Primary School"
          />
        </div>
      </div>

      {!isEdit && (
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Parent Details
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              placeholder="Required if the parent is new"
            />
            <Input
              label="Date of Birth"
              name="parentDob"
              type="date"
              value={form.parentDob}
              onChange={handleChange}
            />
            <Input
              label="Email Address"
              name="parentEmail"
              type="email"
              value={form.parentEmail}
              onChange={handleChange}
              placeholder="parent@example.com"
            />
            <Input
              label="Phone Number"
              name="parentPhone"
              type="tel"
              value={form.parentPhone}
              onChange={handleChange}
              placeholder="Required if the parent is new"
            />
            <Input
              label="Initial password"
              name="parentPassword"
              type="password"
              value={form.parentPassword}
              onChange={handleChange}
              placeholder="Required if the parent is new"
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Student'}
      </Button>
    </form>
  );
};

export default StudentForm;
