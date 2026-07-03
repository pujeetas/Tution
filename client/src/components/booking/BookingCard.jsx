import BookingStatus from './BookingStatus.jsx';
import Button from '../common/Button.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

// Shows one booking. `viewerRole` decides which name and actions to show.
const BookingCard = ({ booking, viewerRole, onStatusChange, updating }) => {
  const otherParty = viewerRole === 'tutor' ? booking.parent : booking.tutor;

  const tutorActions = {
    Pending: [{ label: 'Confirm', status: 'Confirmed', variant: 'success' }],
    Confirmed: [{ label: 'Mark Completed', status: 'Completed', variant: 'primary' }],
  };

  const actions =
    viewerRole === 'tutor' ? tutorActions[booking.status] || [] : [];

  const canCancel =
    (booking.status === 'Pending' || booking.status === 'Confirmed') && onStatusChange;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {booking.subject} · {booking.childLevel}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {viewerRole === 'tutor' ? 'Booked by' : 'Tutor'}: {otherParty?.name}
          </p>
        </div>
        <BookingStatus status={booking.status} />
      </div>

      <div className="grid gap-1 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
        <p>
          <span className="font-medium">When:</span> {formatDateTime(booking.date)}
        </p>
        <p>
          <span className="font-medium">Duration:</span> {booking.durationHours}h ·{' '}
          {booking.mode === 'online' ? 'Online' : 'In-person'}
        </p>
        <p>
          <span className="font-medium">Student:</span> {booking.childName}
        </p>
        {viewerRole === 'tutor' && booking.parent?.phone && (
          <p>
            <span className="font-medium">Contact:</span> {booking.parent.phone}
          </p>
        )}
      </div>

      {booking.notes && (
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <span className="font-medium">Notes:</span> {booking.notes}
        </p>
      )}

      {(actions.length > 0 || canCancel) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {actions.map((action) => (
            <Button
              key={action.status}
              variant={action.variant}
              disabled={updating}
              onClick={() => onStatusChange(booking._id, action.status)}
            >
              {action.label}
            </Button>
          ))}
          {canCancel && (
            <Button
              variant="danger"
              disabled={updating}
              onClick={() => onStatusChange(booking._id, 'Cancelled')}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
