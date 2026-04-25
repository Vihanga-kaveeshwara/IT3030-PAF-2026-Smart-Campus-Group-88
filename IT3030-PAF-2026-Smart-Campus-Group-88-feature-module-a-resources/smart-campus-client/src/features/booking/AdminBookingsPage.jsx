import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from './BookingContext';
import { Link } from 'react-router-dom';

const AdminBookingsPage = () => {
  const { state, fetchAllBookings } = useContext(BookingContext);
  const { allBookings, loading, error } = state;

  const [filters, setFilters] = useState({
    status: '',
    resourceId: '',
    requesterId: '',
    fromDate: '',
    toDate: ''
  });

  // Debounced filters: only update after 500ms of no changes to avoid
  // firing an API call on every keystroke in the text inputs.
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  useEffect(() => {
    fetchAllBookings(debouncedFilters);
  }, [debouncedFilters, fetchAllBookings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: '', resourceId: '', requesterId: '', fromDate: '', toDate: '' });
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

  const getFacilityName = (resourceId) => {
    const facility = state.facilities.find(f => f.id === resourceId);
    return facility ? facility.name : resourceId;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Bookings Management</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Facility ID</label>
              <input
                type="text"
                name="resourceId"
                value={filters.resourceId}
                onChange={handleFilterChange}
                placeholder="Facility ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Requester</label>
              <input
                type="text"
                name="requesterId"
                value={filters.requesterId}
                onChange={handleFilterChange}
                placeholder="User ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition text-sm"
          >
            Clear Filters
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">BOOKING ID</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">FACILITY</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">REQUESTER</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">DATE</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">TIME</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">PURPOSE</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">STATUS</th>
                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && <tr><td colSpan="8" className="text-center py-5">Loading...</td></tr>}
              {error && <tr><td colSpan="8" className="text-center py-5 text-red-500">Error: {error}</td></tr>}
              {!loading && !error && allBookings.length === 0 && (
                <tr><td colSpan="8" className="text-center py-5 text-gray-500">No bookings found</td></tr>
              )}
              {!loading && !error && allBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-medium text-gray-900 text-sm font-mono">{booking.id || 'N/A'}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{getFacilityName(booking.resourceId)}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{booking.requesterId}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{formatDate(booking.date)}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm truncate">{booking.purpose}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Link
                      to={`/booking/admin/manage/${booking.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#053769] text-white text-xs font-medium rounded-lg hover:bg-[#042d55] transition"
                    >
                      ⚙️ Manage
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

export default AdminBookingsPage;
