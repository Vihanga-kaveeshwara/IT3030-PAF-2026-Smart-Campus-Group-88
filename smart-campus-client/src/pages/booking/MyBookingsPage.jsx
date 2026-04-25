import React, { useContext, useEffect } from 'react';
import { BookingContext, STATIC_USER_ID } from './BookingContext';
import { Link, useSearchParams } from 'react-router-dom';

const MyBookingsPage = () => {
  const { state, fetchMyBookings } = useContext(BookingContext);
  const [searchParams] = useSearchParams();
  const { bookings, loading, error, facilities } = state;

  const requesterId = searchParams.get('requesterId') || STATIC_USER_ID;

  useEffect(() => {
    fetchMyBookings(requesterId);
  }, [requesterId, fetchMyBookings]);

  const getFacilityName = (resourceId) => {
    const facility = facilities.find(f => f.id === resourceId);
    return facility ? facility.name : resourceId;
  };

  const getStatusColor = (status) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-700';
    if (status === 'PENDING') return 'bg-blue-100 text-blue-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    if (status === 'CANCELLED') return 'bg-gray-100 text-gray-700';
    return 'bg-purple-100 text-purple-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-600">Showing bookings for: <span className="font-medium">{requesterId}</span></p>
          </div>
          <Link
            to="/booking/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#053769] text-white font-medium rounded-xl hover:bg-[#042d55] transition"
          >
            ➕ New Booking
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">BOOKING ID</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">FACILITY</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">DATE</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">TIME SLOT</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">PURPOSE</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">ATTENDEES</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">STATUS</th>
                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && <tr><td colSpan="8" className="text-center py-5">Loading bookings...</td></tr>}
              {error && <tr><td colSpan="8" className="text-center py-5 text-red-500">Error: {error}</td></tr>}
              {!loading && !error && requesterId && bookings.length === 0 && (
                <tr><td colSpan="8" className="text-center py-5 text-gray-500">No bookings found. Create one to get started!</td></tr>
              )}
              {!loading && !error && bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-medium text-gray-900 text-sm font-mono">{booking.id || 'N/A'}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{getFacilityName(booking.resourceId)}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{formatDate(booking.date)}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{booking.purpose}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{booking.expectedAttendees}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Link
                      to={`/booking/detail/${booking.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#053769] text-white text-xs font-medium rounded-lg hover:bg-[#042d55] transition"
                    >
                      👁️ View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
