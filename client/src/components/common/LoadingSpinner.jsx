const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

export default LoadingSpinner;
