// Frontend: src/features/maintenance/TechnicianTicketDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TechnicianTicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy Ticket Data
  const [ticket, setTicket] = useState({
    id: id || "TKT-2401",
    status: "In Progress",
    priority: "High",
    location: "Library - 3rd Floor",
    category: "Electrical",
    reportedBy: "John Doe",
    contact: "john.doe@sliit.lk",
    description: "Multiple power outlets on the third floor of the library are not working. Students are unable to charge their laptops. This is affecting study sessions and needs immediate attention.",
    createdDate: "Apr 14, 2026, 10:30 AM",
    assignedDate: "Apr 14, 2026, 11:00 AM",
    timeElapsedHours: 42,
    progress: 65,
    attachments: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?q=80&w=2066&auto=format&fit=crop"
    ],
    comments: [
      { id: 1, author: "Admin (System Administrator)", time: "Apr 14, 11:00 AM", text: "Ticket received and assigned to electrician Mike Johnson." },
      { id: 2, author: "Mike Johnson (Technician)", time: "Apr 14, 02:30 PM", text: "I've inspected the area. The issue is with the circuit breaker. Will need to replace it. ETA: 2 hours." },
      { id: 3, author: "John Doe (Student)", time: "Apr 14, 03:00 PM", text: "Thank you for the quick response! Looking forward to the resolution." }
    ]
  });

  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showNotesField, setShowNotesField] = useState(false);

  // Time Color Logic
  const getTimeColor = (hours) => {
    if (hours < 24) return "bg-green-50 text-green-700 border-green-200";
    if (hours <= 48) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const handleStartWork = () => {
    setTicket({ ...ticket, status: "In Progress" });
  };

  const handleShowResolve = () => {
    setShowNotesField(true);
  };

  const handleResolve = () => {
    if (!resolutionNotes.trim()) {
      alert("Please provide resolution notes before resolving the ticket.");
      return;
    }
    setTicket({ ...ticket, status: "Resolved", progress: 100 });
    setShowNotesField(false);
    // Submit to backend simulation
    alert("Ticket resolved successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header and Back Button */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wide mb-1 font-semibold">FRAME 7: TECHNICIAN DASHBOARD - TICKET DETAIL VIEW</p>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#053769]">Ticket Details</h1>
          </div>
          <p className="text-gray-500 mt-2">
            Ticket ID: <span className="font-bold text-[#053769]">{ticket.id}</span>
          </p>
        </div>
        
        {/* Timer Badge */}
        <div className={`px-6 py-3 rounded-xl border flex flex-col items-center justify-center ${getTimeColor(ticket.timeElapsedHours)}`}>
          <span className="text-[10px] uppercase font-bold tracking-wider mb-1">Time Elapsed</span>
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <span className="text-2xl font-bold">{ticket.timeElapsedHours}h</span>
          </div>
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="mb-6 text-[#053769] font-medium hover:underline flex items-center gap-1">
        ← Back to Assigned Tickets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Specs) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Information Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Ticket Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-6">
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>📍</span> Resource/Location</p>
                <p className="font-semibold text-gray-800">{ticket.location}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>🏷️</span> Category</p>
                <p className="font-semibold text-gray-800">{ticket.category}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>⚠️</span> Priority</p>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                  ticket.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>📋</span> Status</p>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                  ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 
                  ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>👤</span> Reported By</p>
                <p className="font-semibold text-gray-800">{ticket.reportedBy}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>✉️</span> Contact</p>
                <p className="font-semibold text-gray-800">{ticket.contact}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-gray-500 text-sm mb-2">Description</p>
              <p className="text-gray-700 text-sm leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Attachments</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {ticket.attachments.map((url, idx) => (
                <img key={idx} src={url} alt={`Attachment ${idx}`} className="h-40 w-auto rounded-xl object-cover border" />
              ))}
            </div>
          </div>
          
          {/* Resolution Notes Input */}
          {(showNotesField || ticket.status === 'Resolved') && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Resolution Notes</h2>
              <p className="text-sm text-gray-500 mb-4">Provide detailed notes about the work performed and resolution</p>
              {ticket.status !== 'Resolved' ? (
                <>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#053769] outline-none min-h-[100px] mb-4"
                    placeholder="Describe the actions taken, parts replaced, or any other relevant details..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                  <button onClick={handleResolve} className="bg-[#053769] hover:bg-[#04284d] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
                    Save Notes & Resolve
                  </button>
                </>
              ) : (
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">{resolutionNotes || "Circuit breaker replaced and tested successfully."}</p>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><span>💬</span> Comments & Updates</h2>
            <div className="space-y-4 mb-6">
              {ticket.comments.map(c => (
                <div key={c.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{c.author}</span>
                    <span className="text-xs text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
            {ticket.status !== 'Resolved' && (
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Add a comment or update..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#053769]" />
                <button className="bg-[#053769] hover:bg-[#04284d] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition self-start">
                  Post Comment
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Sidebar timeline/actions) */}
        <div className="space-y-6">
          {/* Actions */}
          {ticket.status !== 'Resolved' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Actions</h2>
              {ticket.status === 'Assigned' && (
                <button onClick={handleStartWork} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2 shadow-sm">
                  <span>▶️</span> Start Work
                </button>
              )}
              {ticket.status === 'In Progress' && !showNotesField && (
                <button onClick={handleShowResolve} className="w-full bg-[#053769] hover:bg-[#04284d] text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2 shadow-sm">
                  <span>✅</span> Mark as Resolved
                </button>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ticket Timeline</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Created</p>
                <p className="text-sm font-medium text-gray-800">{ticket.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Assigned to You</p>
                <p className="text-sm font-medium text-gray-800">{ticket.assignedDate}</p>
              </div>
            </div>
          </div>

          {/* Work Progress Component */}
          {ticket.status !== 'Resolved' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Work Progress</h2>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-500">Completion</span>
                <span className="text-sm font-bold text-orange-500">{ticket.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${ticket.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400">Update progress as you work on this ticket</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TechnicianTicketDetailPage;
