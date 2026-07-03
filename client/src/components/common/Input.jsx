const Input = ({ label, error, as = 'input', children, className = '', ...props }) => {
  const baseClass = `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 ${
    error ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'
  } ${className}`;

  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      {as === 'select' ? (
        <select className={baseClass} {...props}>
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea className={baseClass} rows={4} {...props} />
      ) : (
        <input className={baseClass} {...props} />
      )}
      {error && (
        <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </label>
  );
};

export default Input;
