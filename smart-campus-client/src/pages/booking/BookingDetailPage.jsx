import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from './BookingContext';
import { useParams, useNavigate } from 'react-router-dom';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, getBooking, cancelBooking } = useContext(BookingContext);
  const [cancelling, setCancelling] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);
    getBooking(id).finally(() => setPageLoading(false));
  }, [id, getBooking]);

  const booking = state.currentBooking;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-700 border-green-300',
      PENDING: 'bg-blue-100 text-blue-700 border-blue-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300',
      CANCELLED: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[status] || 'bg-purple-100 text-purple-700 border-purple-300';
  };

  const goBackToMyBookings = (requesterId) => {
    navigate(`/booking/my-bookings?requesterId=${encodeURIComponent(requesterId)}`);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancelling(true);
      try {
        await cancelBooking(id);
        alert('✅ Booking cancelled successfully');
        goBackToMyBookings(booking.requesterId);
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setCancelling(false);
      }
    }
  };

  if (pageLoading || state.loading) {
    return <div className="p-8 text-center">Loading booking details...</div>;
  }

  if (!booking || booking.id !== id) {
    return <div className="p-8 text-center text-red-500">Booking not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => goBackToMyBookings(booking.requesterId)}
        className="mb-6 text-[#053769] hover:underline font-medium"
      >
        ← Back to My Bookings
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">

        <div className="flex justify-between items-start mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Details</h1>
            <p className="text-gray-600">Booking ID: <span className="font-mono font-medium">{booking.id}</span></p>
          </div>
          <div className={`px-6 py-2 rounded-full border-2 font-bold text-lg ${getStatusBadge(booking.status)}`}>
            {booking.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facility</p>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {state.facilities.find(f => f.id === booking.resourceId)?.name || booking.resourceId}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{formatDate(booking.date)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Slot</p>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected Attendees</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{booking.expectedAttendees} people</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{booking.purpose}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Requester ID</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{booking.requesterId}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created On</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{formatDateTime(booking.createdAt)}</p>
            </div>

            {booking.status === 'REJECTED' && booking.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Rejection Reason</p>
                <p className="text-gray-700 mt-2">{booking.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {booking.status === 'APPROVED' && (
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : '❌ Cancel Booking'}
            </button>
          </div>
        )}

        {booking.status === 'PENDING' && (
          <div className="flex gap-4 pt-6 border-t">
            <div className="flex-1 px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-blue-700 font-medium">
              ⏳ Awaiting Admin Approval
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailPage;
