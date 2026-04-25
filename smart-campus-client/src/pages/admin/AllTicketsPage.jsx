import React, { useContext, useEffect, useState } from 'react';
import { TicketContext } from '../../features/maintenance/TicketContext';
import { Link } from 'react-router-dom';

const AllTicketsPage = () => {
  const { state, fetchAllTickets, assignTicket, updateStatus, rejectTicket } = useContext(TicketContext);
  const { allTickets, loading, error } = state;

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignee: ''
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: '', priority: '', category: '', assignee: '' });
  };

  const getStatusColor = (status) => {
    if (status === 'OPEN') return 'bg-blue-100 text-blue-700';
    if (status === 'IN_PROGRESS') return 'bg-yellow-100 text-yellow-700';
    if (status === 'RESOLVED') return 'bg-green-100 text-green-700';
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    return 'bg-purple-100 text-purple-700';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return 'bg-red-100 text-red-700 border-red-300';
    if (priority === 'MEDIUM') return 'bg-orange-100 text-orange-700 border-orange-300';
    if (priority === 'LOW') return 'bg-green-100 text-green-700 border-green-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleAssignTicket = async (ticketId) => {
    const assignee = prompt('Enter technician name to assign:');
    if (assignee && assignee.trim()) {
      try {
        await assignTicket(ticketId, assignee.trim());
        alert('✅ Ticket assigned successfully');
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await updateStatus(ticketId, newStatus);
      alert('✅ Status updated successfully');
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleRejectTicket = async (ticketId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason && reason.trim()) {
      try {
        await rejectTicket(ticketId, reason.trim());
        alert('✅ Ticket rejected successfully');
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const filteredTickets = allTickets.filter(ticket => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.category && ticket.category !== filters.category) return false;
    if (filters.assignee && ticket.assignee !== filters.assignee) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Tickets Management</h1>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Priority</label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="HVAC">HVAC</option>
                <option value="CARPENTRY">Carpentry</option>
                <option value="NETWORK">Network</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Assignee</label>
              <input
                type="text"
                name="assignee"
                value={filters.assignee}
                onChange={handleFilterChange}
                placeholder="Technician name"
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
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">TICKET ID</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">TITLE</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">CATEGORY</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">PRIORITY</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">REPORTER</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">ASSIGNEE</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">STATUS</th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">CREATED</th>
                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && <tr><td colSpan="9" className="text-center py-5">Loading...</td></tr>}
              {error && <tr><td colSpan="9" className="text-center py-5 text-red-500">Error: {error}</td></tr>}
              {!loading && !error && filteredTickets.length === 0 && (
                <tr><td colSpan="9" className="text-center py-5 text-gray-500">No tickets found</td></tr>
              )}
              {!loading && !error && filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-medium text-gray-900 text-sm font-mono">{ticket.id || 'N/A'}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">
                    <div className="max-w-xs truncate" title={ticket.title}>
                      {ticket.title}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{ticket.category || 'N/A'}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{ticket.reporterId || 'N/A'}</td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{ticket.assignee || 'Unassigned'}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-700 text-sm">{formatDate(ticket.createdAt)}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 justify-center">
                      <Link
                        to={`/admin/maintenance/ticket/${ticket.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition"
                      >
                        👁️ View
                      </Link>
                      
                      {ticket.status === 'OPEN' && !ticket.assignee && (
                        <button
                          onClick={() => handleAssignTicket(ticket.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition"
                        >
                          👤 Assign
                        </button>
                      )}
                      
                      {ticket.status === 'OPEN' && (
                        <button
                          onClick={() => handleRejectTicket(ticket.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition"
                        >
                          ❌ Reject
                        </button>
                      )}
                      
                      {ticket.status === 'OPEN' && ticket.assignee && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700 transition"
                        >
                          ▶️ Start
                        </button>
                      )}
                    </div>
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

export default AllTicketsPage;
