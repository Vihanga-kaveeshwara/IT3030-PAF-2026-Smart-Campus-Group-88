import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TicketContext } from './TicketContext';
import { formatTicketId } from './ticketIdFormatter';

const TechnicianMyAssignedTicketsPage = () => {
  const { state, fetchAssignedTickets } = useContext(TicketContext);

  useEffect(() => {
    fetchAssignedTickets();
  }, [fetchAssignedTickets]);

  const tickets = state.assignedTickets || [];
  const inProgressCount = tickets.filter((ticket) => ticket.status?.toLowerCase() === 'in progress').length;
  const highPriorityCount = tickets.filter((ticket) => ticket.priority?.toLowerCase() === 'high' && ticket.status?.toLowerCase() !== 'resolved').length;

  const getElapsedHours = (createdDate) => {
    if (!createdDate) return '0h';
    const elapsedHours = Math.max(0, Math.floor((Date.now() - new Date(createdDate).getTime()) / (1000 * 60 * 60)));
    return `${elapsedHours}h`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-gray-500 text-sm uppercase tracking-wide mb-1 font-semibold"> TECHNICIAN DASHBOARD - MY ASSIGNED TICKETS</p>
        <h1 className="text-3xl font-bold text-[#053769] mb-2">My Assigned Tickets</h1>
        <p className="text-gray-500">View and manage tickets assigned to you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Assigned</p>
            <p className="text-3xl font-bold text-[#053769]">{tickets.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center text-xl">
          📌
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">In Progress</p>
            <p className="text-3xl font-bold text-orange-500">{inProgressCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl">
            ⏳
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">High Priority</p>
            <p className="text-3xl font-bold text-red-500">{highPriorityCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl">
          ‼️
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {state.loading && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
            Loading assigned tickets...
          </div>
        )}

        {!state.loading && tickets.length === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
            No tickets are currently assigned to you.
          </div>
        )}

        {!state.loading && tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between relative overflow-hidden group">
            <div className="flex-1 pr-6 relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-lg text-gray-800">{formatTicketId(ticket.id)}</span>
                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-md ${
                  ticket.priority?.toLowerCase() === 'high' ? 'bg-red-50 text-red-600' :
                  ticket.priority?.toLowerCase() === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-green-50 text-green-600'
                }`}
                >
                  {(ticket.priority || 'Low').toUpperCase()} PRIORITY
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                  ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                  ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-4 flex justify-center text-gray-400">L</span>
                  {ticket.resourceLocation}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 flex justify-center text-gray-400">C</span>
                  {ticket.category}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-6">{ticket.description}</p>

              {ticket.status !== 'Resolved' && (
                <div className="w-full lg:w-3/4">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                    <span>Work Progress</span>
                    <span className="text-orange-500">{ticket.workProgress ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${ticket.workProgress ?? 0}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between items-end md:w-48 mt-6 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 relative z-10">
              <div className="text-right mb-4 md:mb-0">
                <div className="flex items-center justify-end gap-1 text-gray-800 font-bold text-xl">
                   {getElapsedHours(ticket.createdDate)}
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Time Elapsed</span>
              </div>

              <Link to={`/maintenance/technician/ticket/${ticket.id}`} className="w-full">
                <button className="w-full bg-[#053769] hover:bg-[#04284d] text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition shadow-sm">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianMyAssignedTicketsPage;
