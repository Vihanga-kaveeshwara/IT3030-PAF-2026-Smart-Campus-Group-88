import React from 'react';

const MyTicketsPage = () => {
    const tickets = [
        {
            id: 'TKT-2401',
            resource: 'Library - 3rd Floor',
            category: 'Electrical',
            priority: 'High',
            status: 'In Progress',
            created: 'Apr 14, 2026',
        },
        {
            id: 'TKT-2398',
            resource: 'Building A - Room 205',
            category: 'HVAC',
            priority: 'Medium',
            status: 'Open',
            created: 'Apr 12, 2026',
        },
        {
            id: 'TKT-2385',
            resource: 'Cafeteria - Main Hall',
            category: 'Plumbing',
            priority: 'Low',
            status: 'Resolved',
            created: 'Apr 8, 2026',
        },
        {
            id: 'TKT-2372',
            resource: 'Computer Lab 3',
            category: 'IT Equipment',
            priority: 'High',
            status: 'Assigned',
            created: 'Apr 5, 2026',
        },
        {
            id: 'TKT-2365',
            resource: 'Sports Complex',
            category: 'Safety',
            priority: 'Medium',
            status: 'Resolved',
            created: 'Apr 3, 2026',
        },
    ];

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
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-5 font-medium text-gray-900">{ticket.id}</td>
                                    <td className="px-6 py-5 text-gray-700">{ticket.resource}</td>
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
                                    <td className="px-6 py-5 text-gray-600">{ticket.created}</td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => alert(`Opening details for ${ticket.id} (Ticket Detail Page will be added next)`)}
                                            className="inline-flex items-center gap-2 px-5 py-2 bg-[#053769] text-white text-sm font-medium rounded-xl hover:bg-[#042d55] transition"
                                        >
                                            👁️ View
                                        </button>
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