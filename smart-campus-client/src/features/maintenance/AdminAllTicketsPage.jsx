// Frontend: src/features/maintenance/AdminAllTicketsPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TicketContext } from './TicketContext';

const AdminAllTicketsPage = () => {
  const { state, fetchAllTickets } = useContext(TicketContext);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  const renderPriorityBadge = (priority) => {
    const p = priority?.toLowerCase() || '';
    if (p === 'high') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">High</span>;
    if (p === 'medium') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">Medium</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">Low</span>;
  };

  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'open') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">Open</span>;
    if (s === 'in progress') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">In Progress</span>;
    if (s === 'resolved') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">Resolved</span>;
    if (s === 'rejected') return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Rejected</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">Assigned</span>;
  };

  const filteredTickets = state.allTickets.filter(t => {
    const matchStatus = statusFilter === 'All' || (t.status && t.status.toLowerCase() === statusFilter.toLowerCase());
    const matchPriority = priorityFilter === 'All' || (t.priority && t.priority.toLowerCase() === priorityFilter.toLowerCase());
    const matchCategory = categoryFilter === 'All' || (t.category && t.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchStatus && matchPriority && matchCategory;
  });

  const openTicketsCount = state.allTickets.filter(t => t.status?.toLowerCase() === 'open').length;
  const highPriorityCount = state.allTickets.filter(t => t.priority?.toLowerCase() === 'high' && t.status?.toLowerCase() !== 'resolved').length;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col xl:flex-row gap-6 text-gray-800">
      <div className="flex-1 drop-shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Maintenance Dashboard</h1>
        <p className="text-gray-500 mb-8">Manage all maintenance tickets and assign technicians</p>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#053769]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
            <select className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#053769]" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#053769]" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Furniture">Furniture</option>
              <option value="IT Equipment">IT Equipment</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
            <select className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#053769]">
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Ticket ID</th>
                <th className="p-4">Resource/Location</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Created</th>
                <th className="p-4">Time Elapsed</th>
                <th className="p-4 pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {state.loading && <tr><td colSpan="9" className="p-6 text-center text-gray-400">Loading...</td></tr>}
              {!state.loading && filteredTickets.length === 0 && (
                <tr><td colSpan="9" className="p-6 text-center text-gray-400">No tickets found</td></tr>
              )}
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 pl-6 font-semibold text-[#053769]">
                    {ticket.id ? `TKT-${ticket.id.substring(ticket.id.length - 4).toUpperCase()}` : 'TKT-NEW'}
                  </td>
                  <td className="p-4 text-gray-700">{ticket.resourceLocation}</td>
                  <td className="p-4 text-gray-600">{ticket.category}</td>
                  <td className="p-4">{renderPriorityBadge(ticket.priority)}</td>
                  <td className="p-4">{renderStatusBadge(ticket.status)}</td>
                  <td className="p-4 text-gray-500 italic">{ticket.assignee || 'Unassigned'}</td>
                  <td className="p-4 text-gray-500">{new Date(ticket.createdDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="p-4 font-medium text-orange-600">24h</td>
                  <td className="p-4 pr-6">
                    <Link to={`/maintenance/admin/ticket/${ticket.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-[#053769] font-medium text-xs rounded-lg hover:bg-gray-50 transition">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar Stats */}
      <div className="w-full xl:w-64 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-teal-400">
          <div className="flex gap-3 text-gray-500 text-sm font-medium items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            Avg Resolution Time
          </div>
          <div className="text-3xl font-bold text-[#053769] mb-1">36h</div>
          <div className="text-xs text-gray-400">Last 30 days</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-400">
          <div className="flex gap-3 text-gray-500 text-sm font-medium items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
            </div>
            Open Tickets
          </div>
          <div className="text-3xl font-bold text-[#053769] mb-1">{openTicketsCount}</div>
          <div className="text-xs text-gray-400">Awaiting assignment</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-400">
          <div className="flex gap-3 text-gray-500 text-sm font-medium items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            High Priority
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">{highPriorityCount}</div>
          <div className="text-xs text-gray-400">Requires immediate attention</div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllTicketsPage;
