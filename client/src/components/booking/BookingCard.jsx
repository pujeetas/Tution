import BookingStatus from './BookingStatus.jsx';
import Button from '../common/Button.jsx';
import { formatDateTime } from '../../utils/formatDate.js';
import { PAYMENT_STATUS_COLORS } from '../../utils/constants.js';

// Shows one booking. `viewerRole` decides which name and actions to show.
const BookingCard = ({ booking, viewerRole, onStatusChange, onPay, updating }) => {
  const managesBooking = viewerRole === 'tutor' || viewerRole === 'centre';
  const otherParty = viewerRole === 'tutor' ? booking.parent : booking.tutor;

  const tutorActions = {
    Pending: [{ label: 'Confirm', status: 'Confirmed', variant: 'success' }],
    Confirmed:
      booking.paymentStatus === 'paid'
        ? [{ label: 'Mark Completed', status: 'Completed', variant: 'primary' }]
        : [],
  };

  const actions = managesBooking ? tutorActions[booking.status] || [] : [];

  const canCancel =
    (booking.status === 'Pending' || booking.status === 'Confirmed') && onStatusChange;

  const canPay =
    viewerRole === 'parent' &&
    booking.status === 'Confirmed' &&
    booking.paymentStatus === 'unpaid' &&
    onPay;

  const waitingForPayment =
    managesBooking && booking.status === 'Confirmed' && booking.paymentStatus !== 'paid';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {booking.subject} · {booking.student?.level}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {viewerRole === 'centre' ? (
              <>
                Tutor: {booking.tutor?.name} · Parent: {booking.parent?.name}
              </>
            ) : (
              <>
                {viewerRole === 'tutor' ? 'Booked by' : 'Tutor'}: {otherParty?.name}
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <BookingStatus status={booking.status} />
          {typeof booking.paymentStatus === 'string' && (
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_STATUS_COLORS[booking.paymentStatus]}`}
            >
              {booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
          )}
        </div>
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
          <span className="font-medium">Student:</span> {booking.student?.name}
        </p>
        {typeof booking.amount === 'number' && (
          <p>
            <span className="font-medium">Amount:</span> S${booking.amount.toFixed(0)}
          </p>
        )}
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

      {waitingForPayment && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Waiting for the parent to pay before this session can be marked completed.
        </p>
      )}

      {(actions.length > 0 || canCancel || canPay) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {canPay && (
            <Button variant="success" disabled={updating} onClick={() => onPay(booking._id)}>
              Simulate Payment
            </Button>
          )}
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
