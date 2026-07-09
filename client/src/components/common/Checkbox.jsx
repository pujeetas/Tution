import { useEffect, useRef } from 'react';

// Styled checkbox with `indeterminate` support (not a real HTML attribute,
// so it has to be set imperatively via a ref) — used for the header
// select-all control when some but not all rows are selected.
const Checkbox = ({ indeterminate = false, className = '', ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 ${className}`}
      {...props}
    />
  );
};

export default Checkbox;
