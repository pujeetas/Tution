import { useState } from 'react';

// One collapsible section of the Form Builder field editor (e.g. "Student
// Details Section"): a static-order list of fields, each removable/toggle-
// required via a ⋮ menu unless `locked`, plus an "+ Add item" picker to bring
// back removed fields. `includeToggle` (optional) lets the whole section be
// switched off, e.g. the Student form's Parent Details section.
const FieldSection = ({ title, fields, onChange, includeToggle }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  const visible = fields.filter((f) => f.included);
  const hidden = fields.filter((f) => !f.included);
  const sectionDisabled = includeToggle && !includeToggle.checked;

  const updateField = (key, patch) => {
    onChange(fields.map((f) => (f.key === key ? { ...f, ...patch } : f)));
  };

  const toggleRequired = (field) => {
    updateField(field.key, { required: !field.required });
    setMenuOpen(null);
  };

  const removeField = (key) => {
    updateField(key, { included: false });
    setMenuOpen(null);
  };

  const addBack = (key) => {
    updateField(key, { included: true });
    setShowAddPicker(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {includeToggle && (
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={includeToggle.checked}
              onChange={includeToggle.onChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Include this section
          </label>
        )}
      </div>

      {!sectionDisabled && (
        <>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {visible.map((f) => (
              <div key={f.key} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {f.label}
                  {f.required && <span className="ml-1 text-red-500">*</span>}
                </span>
                {!f.locked && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpen(menuOpen === f.key ? null : f.key)}
                      className="rounded px-2 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                      aria-label={`Options for ${f.label}`}
                    >
                      &#8942;
                    </button>
                    {menuOpen === f.key && (
                      <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                          type="button"
                          onClick={() => toggleRequired(f)}
                          className="block w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {f.required ? 'Make optional' : 'Make compulsory'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeField(f.key)}
                          className="block w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove field
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-2 dark:border-gray-800">
            {showAddPicker && hidden.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-1">
                {hidden.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => addBack(f.key)}
                    className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-primary-400 hover:text-primary-600 dark:border-gray-700 dark:text-gray-400"
                  >
                    + {f.label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddPicker(true)}
                disabled={hidden.length === 0}
                className="w-full rounded-md py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {hidden.length === 0 ? 'All fields added' : '+ Add item'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FieldSection;
