import { STATUS_COLORS } from '../../utils/constants.js';

const BookingStatus = ({ status }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
    }`}
  >
    {status}
  </span>
);

export default BookingStatus;
