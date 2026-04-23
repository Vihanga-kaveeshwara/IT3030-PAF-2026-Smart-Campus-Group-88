import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketContext } from './TicketContext';
import { formatTicketId } from './ticketIdFormatter';

const TechnicianTicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicket, startWork, resolveTicket, addTicketComment } = useContext(TicketContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showNotesField, setShowNotesField] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicket(id);
        setTicket(data);
        setResolutionNotes(data.resolutionNotes || '');
      } catch (error) {
        console.error('Error fetching ticket', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [getTicket, id]);

  const timeElapsedHours = ticket?.createdDate
    ? Math.floor((Date.now() - new Date(ticket.createdDate).getTime()) / (1000 * 60 * 60))
    : 0;

  const progress = ticket?.status?.toLowerCase() === 'resolved'
    ? 100
    : ticket?.status?.toLowerCase() === 'in progress'
      ? 65
      : ticket?.status?.toLowerCase() === 'assigned'
        ? 25
        : 5;

  const attachments = Array.isArray(ticket?.images) ? ticket.images : [];
  const comments = Array.isArray(ticket?.comments) ? ticket.comments : [];

  const getTimeColor = (hours) => {
    if (hours < 24) return 'bg-green-50 text-green-700 border-green-200';
    if (hours <= 48) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const handleStartWork = async () => {
    try {
      const updatedTicket = await startWork(id);
      setTicket(updatedTicket);
    } catch (error) {
      alert('Failed to start work on this ticket.');
    }
  };

  const handleShowResolve = () => {
    setShowNotesField(true);
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      alert('Please provide resolution notes before resolving the ticket.');
      return;
    }

    try {
      const updatedTicket = await resolveTicket(id, resolutionNotes);
      setTicket(updatedTicket);
      setShowNotesField(false);
      alert('Ticket resolved successfully!');
    } catch (error) {
      alert('Failed to resolve this ticket.');
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) {
      alert('Please enter a comment before posting.');
      return;
    }

    try {
      const updatedTicket = await addTicketComment(id, {
        authorName: ticket?.assignee || 'Technician',
        authorRole: 'Technician',
        content: commentText,
      });
      setTicket(updatedTicket);
      setCommentText('');
    } catch (error) {
      alert('Failed to post comment.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading ticket...</div>;
  if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wide mb-1 font-semibold">TECHNICIAN DASHBOARD</p>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#053769]">Ticket Details</h1>
          </div>
          <p className="text-gray-500 mt-2">
            Ticket ID: <span className="font-bold text-[#053769]">{formatTicketId(ticket.id)}</span>
          </p>
        </div>
        
        <div className={`px-6 py-3 rounded-xl border flex flex-col items-center justify-center ${getTimeColor(timeElapsedHours)}`}>
          <span className="text-[10px] uppercase font-bold tracking-wider mb-1">Time Elapsed</span>
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <span className="text-2xl font-bold">{timeElapsedHours}h</span>
          </div>
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="mb-6 text-[#053769] font-medium hover:underline flex items-center gap-1">
        ← Back to Assigned Tickets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Ticket Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-6">
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>📍</span> Resource/Location</p>
                <p className="font-semibold text-gray-800">{ticket.resourceLocation}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>🏷️</span> Category</p>
                <p className="font-semibold text-gray-800">{ticket.category}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>⚠️</span> Priority</p>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                  ticket.priority === 'High' ? 'bg-red-50 text-red-600' :
                  ticket.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
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
                <p className="font-semibold text-gray-800">{ticket.userId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><span>✉️</span> Contact</p>
                <p className="font-semibold text-gray-800">{ticket.contactDetails}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-gray-500 text-sm mb-2">Description</p>
              <p className="text-gray-700 text-sm leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Attachments</h2>
            {attachments.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {attachments.map((url, idx) => (
                  <img 
                    key={idx} 
                    src={url} 
                    alt={`Attachment ${idx}`} 
                    onClick={() => setSelectedImage(url)}
                    className="h-40 w-auto rounded-xl object-cover border cursor-pointer hover:opacity-90 transition" 
                  />
                ))}
              </div>
            ) : (
              <div className="h-32 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                No attachments were submitted for this ticket.
              </div>
            )}
          </div>
          
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
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">{ticket.resolutionNotes || resolutionNotes}</p>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><span>💬</span> Comments & Updates</h2>
            <div className="space-y-4 mb-6">
              {comments.length > 0 ? comments.map((comment, index) => (
                <div key={`${comment.timestamp || index}-${index}`} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{comment.authorName} <span className="text-xs text-gray-400">({comment.authorRole})</span></span>
                    <span className="text-xs text-gray-400">{comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{comment.content}</p>
                </div>
              )) : (
                <div className="text-sm text-gray-400">No comments have been posted yet.</div>
              )}
            </div>
            {ticket.status !== 'Resolved' && (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment or update..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#053769]"
                />
                <button onClick={handlePostComment} className="bg-[#053769] hover:bg-[#04284d] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition self-start">
                  Post Comment
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="space-y-6">
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

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ticket Timeline</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Created</p>
                <p className="text-sm font-medium text-gray-800">{new Date(ticket.createdDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Assigned to You</p>
                <p className="text-sm font-medium text-gray-800">{ticket.assignee || 'Unassigned'}</p>
              </div>
            </div>
          </div>

          {ticket.status !== 'Resolved' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Work Progress</h2>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-500">Completion</span>
                <span className="text-sm font-bold text-orange-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400">Update progress as you work on this ticket</p>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Enlarged view" className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default TechnicianTicketDetailPage;
