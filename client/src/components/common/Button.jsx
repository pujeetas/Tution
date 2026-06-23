const VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-500/50',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
  success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
};

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
