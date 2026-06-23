// Format an ISO date string for display, e.g. "Sat, 14 Jun 2026, 3:00 pm"
export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('en-SG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// True if a booking date is in the future
export const isUpcoming = (isoString) => new Date(isoString) > new Date();

// Min value for datetime-local inputs (now, local time)
export const minDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};
