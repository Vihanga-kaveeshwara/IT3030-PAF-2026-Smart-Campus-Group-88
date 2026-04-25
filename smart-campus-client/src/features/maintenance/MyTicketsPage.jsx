import React, { useContext } from 'react';
import { TicketContext } from './TicketContext';
import { Link } from 'react-router-dom';
import { formatTicketIdForUser } from './ticketIdFormatter';

const MyTicketsPage = () => {
    const { state } = useContext(TicketContext);
    const { tickets, loading, error } = state;

    const getPriorityColor = (priority) => {
        if (priority === 'High') return 'bg-red-100 text-red-700';
        if (priority === 'Medium') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getStatusColor = (status) => {
        if (status === 'In Progress') return 'bg-orange-100 text-orange-700';
        if (status === 'Open') return 'bg-blue-100 text-blue-700';
        if (status === 'Resolved') return 'bg-green-100 text-green-700';
        return 'bg-purple-100 text-purple-700';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tickets</h1>
                <p className="text-gray-600 mb-8">
                    View and track all your submitted maintenance requests
                </p>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">TICKET ID</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">RESOURCE/LOCATION</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">CATEGORY</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">PRIORITY</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">STATUS</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500">CREATED DATE</th>
                                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading && <tr><td colSpan="7" className="text-center py-5">Loading tickets...</td></tr>}
                            {error && <tr><td colSpan="7" className="text-center py-5 text-red-500">Error: {error}</td></tr>}
                            {!loading && !error && tickets.length === 0 && (
                                <tr><td colSpan="7" className="text-center py-5 text-gray-500">No tickets found.</td></tr>
                            )}
                            {!loading && !error && tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-5 font-medium text-gray-900">{formatTicketIdForUser(ticket.id)}</td>
                                    <td className="px-6 py-5 text-gray-700">{ticket.resourceLocation}</td>
                                    <td className="px-6 py-5 text-gray-700">{ticket.category}</td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-gray-600">{formatDate(ticket.createdDate)}</td>
                                    <td className="px-6 py-5 text-center">
                                        <Link
                                            to={`/maintenance/ticket/${ticket.id}`}
                                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#053769] text-white text-sm font-medium rounded-xl hover:bg-[#042d55] transition"
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

export default MyTicketsPage;