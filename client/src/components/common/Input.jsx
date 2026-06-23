const Input = ({ label, error, as = 'input', children, className = '', ...props }) => {
  const baseClass = `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
    error ? 'border-red-400' : 'border-gray-300'
  } ${className}`;

  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      {as === 'select' ? (
        <select className={baseClass} {...props}>
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea className={baseClass} rows={4} {...props} />
      ) : (
        <input className={baseClass} {...props} />
      )}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
};

export default Input;
