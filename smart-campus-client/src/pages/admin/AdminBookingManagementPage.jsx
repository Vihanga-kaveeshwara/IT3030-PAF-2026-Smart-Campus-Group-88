import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../booking/BookingContext';
import { useParams, useNavigate } from 'react-router-dom';

const AdminBookingManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, getBooking, approveBooking, rejectBooking } = useContext(BookingContext);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
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

  const getFacilityName = (resourceId) => {
    const facility = state.facilities.find(f => f.id === resourceId);
    return facility ? facility.name : resourceId;
  };

  const handleApprove = async () => {
    if (window.confirm('Approve this booking?')) {
      setActionLoading(true);
      try {
        await approveBooking(id);
        alert('✅ Booking approved successfully');
        navigate('/admin/booking/all');
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (window.confirm('Reject this booking?')) {
      setActionLoading(true);
      try {
        await rejectBooking(id, rejectionReason);
        alert('✅ Booking rejected successfully');
        navigate('/admin/booking/all');
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setActionLoading(false);
        setRejectionReason('');
        setShowRejectForm(false);
      }
    }
  };

  if (pageLoading || state.loading) {
    return <div className="p-8 text-center">Loading booking details...</div>;
  }

  if (!booking || booking.id !== id) {
    return <div className="p-8 text-center text-red-500">Booking not found</div>;
  }

  const canApprove = booking.status === 'PENDING';
  const canReject = booking.status === 'PENDING';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/booking/all')}
        className="mb-6 text-[#053769] hover:underline font-medium"
      >
        ← Back to Admin Bookings
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">

        <div className="flex justify-between items-start mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Management</h1>
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
              <p className="text-lg font-medium text-gray-900 mt-1">{getFacilityName(booking.resourceId)}</p>
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

        {showRejectForm && canReject && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-red-800 mb-4">Reject Booking</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                placeholder="Explain why this booking is being rejected..."
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : '❌ Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t">
          {canApprove && (
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {actionLoading ? 'Approving...' : '✅ Approve Booking'}
            </button>
          )}

          {canReject && !showRejectForm && (
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={actionLoading}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              ❌ Reject Booking
            </button>
          )}

          {!canApprove && !canReject && (
            <div className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center">
              No actions available for {booking.status} bookings
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingManagementPage;
