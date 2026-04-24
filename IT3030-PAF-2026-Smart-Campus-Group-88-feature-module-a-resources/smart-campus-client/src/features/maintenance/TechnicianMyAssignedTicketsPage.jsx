// Frontend: src/features/maintenance/TechnicianMyAssignedTicketsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TechnicianMyAssignedTicketsPage = () => {
  // Dummy data mirroring the screenshot
  const [tickets] = useState([
    {
      id: "TKT-2401",
      priority: "HIGH PRIORITY",
      status: "In Progress",
      location: "Library - 3rd Floor",
      category: "Electrical",
      description: "Multiple power outlets on the third floor of the library are not working.",
      progress: 65,
      timeElapsed: "42h"
    },
    {
      id: "TKT-2385",
      priority: "LOW PRIORITY",
      status: "Assigned",
      location: "Auditorium",
      category: "Electrical",
      description: "Stage lighting system requires routine maintenance and bulb replacement.",
      progress: 0,
      timeElapsed: "192h"
    },
    {
      id: "TKT-2376",
      priority: "MEDIUM PRIORITY",
      status: "Assigned",
      location: "Engineering Building - Lab 2",
      category: "Electrical",
      description: "Backup power generator needs inspection and testing.",
      progress: 0,
      timeElapsed: "216h"
    }
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-500 text-sm uppercase tracking-wide mb-1 font-semibold">FRAME 6: TECHNICIAN DASHBOARD - MY ASSIGNED TICKETS</p>
        <h1 className="text-3xl font-bold text-[#053769] mb-2">My Assigned Tickets</h1>
        <p className="text-gray-500">View and manage tickets assigned to you</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Assigned</p>
            <p className="text-3xl font-bold text-[#053769]">3</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center text-xl">
             🏷️
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">In Progress</p>
            <p className="text-3xl font-bold text-orange-500">1</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl">
            🕒
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">High Priority</p>
            <p className="text-3xl font-bold text-red-500">1</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl">
            ⚠️
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-6">
        {tickets.map((ticket, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between relative overflow-hidden group">
            {/* Left Content */}
            <div className="flex-1 pr-6 relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-bold text-lg text-gray-800">{ticket.id}</span>
                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-md ${
                  ticket.priority.includes('HIGH') ? 'bg-red-50 text-red-600' :
                  ticket.priority.includes('MEDIUM') ? 'bg-yellow-50 text-yellow-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                  ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-4 flex justify-center text-gray-400">📍</span>
                  {ticket.location}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 flex justify-center text-gray-400">🏷️</span>
                  {ticket.category}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-6">{ticket.description}</p>

              {/* Progress Bar (Only visible if progress > 0 in this design context, or just show anyway) */}
              {ticket.status === "In Progress" && (
                <div className="w-full lg:w-3/4">
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                    <span>Work Progress</span>
                    <span className="text-orange-500">{ticket.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${ticket.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Content */}
            <div className="flex flex-col justify-between items-end md:w-48 mt-6 md:mt-0 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 relative z-10">
              <div className="text-right mb-4 md:mb-0">
                <div className="flex items-center justify-end gap-1 text-gray-800 font-bold text-xl">
                  🕒 {ticket.timeElapsed}
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
