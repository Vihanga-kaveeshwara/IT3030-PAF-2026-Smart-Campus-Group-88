import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketContext } from '../../features/maintenance/TicketContext';
import { formatTicketId } from '../../features/maintenance/ticketIdFormatter';

const AdminTicketManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTicket, assignTicket, updateStatus, rejectTicket, addTicketComment } = useContext(TicketContext);
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [fetchingError, setFetchingError] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const data = await getTicket(id);
        setTicket(data);
        setAssignee(data.assignee || '');
        setStatus(data.status || 'Open');
        setPriority(data.priority || 'Medium');
      } catch (err) {
        setFetchingError('Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTicketData();
  }, [id, getTicket]);

  const handleSaveChanges = async () => {
    try {
      let updatedTicket = ticket;

      if (assignee !== ticket.assignee) {
        updatedTicket = await assignTicket(id, assignee);
      }
      const normalizedAssignee = assignee.trim();
      const desiredStatus = normalizedAssignee && status === 'Open' ? 'Assigned' : status;

      if (desiredStatus !== updatedTicket.status) {
        updatedTicket = await updateStatus(id, desiredStatus);
      }

      setTicket(updatedTicket);
      setStatus(updatedTicket.status || desiredStatus);
      alert('Ticket updated successfully!');
      navigate('/maintenance/admin');
    } catch (err) {
      alert('Failed to update ticket.');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const updatedTicket = await rejectTicket(id, reason);
      setTicket(updatedTicket);
      alert('Ticket rejected.');
      navigate('/maintenance/admin');
    } catch (err) {
      alert('Failed to reject ticket.');
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) {
      alert('Please enter a comment before posting.');
      return;
    }

    try {
      const updatedTicket = await addTicketComment(id, {
        authorName: 'Admin',
        authorRole: 'System Administrator',
        content: commentText,
      });
      setTicket(updatedTicket);
      setCommentText('');
      alert('Comment posted successfully.');
    } catch (err) {
      alert('Failed to post comment.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading ticket...</div>;
  if (!ticket || fetchingError) return <div className="p-8 text-center text-red-500">{fetchingError || 'Ticket not found'}</div>;

  const attachments = Array.isArray(ticket.images) ? ticket.images : [];
  const comments = Array.isArray(ticket.comments) ? ticket.comments : [];
  const workProgress = ticket.status?.toLowerCase() === 'resolved' ? 100 : (ticket.workProgress ?? 0);

  const renderPriorityBadge = (p) => {
    const pLow = p?.toLowerCase() || '';
    if (pLow === 'high') return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-600">High</span>;
    if (pLow === 'medium') return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-600">Medium</span>;
    return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-600">Low</span>;
  };

  const renderStatusBadge = (s) => {
    const sLow = s?.toLowerCase() || '';
    if (sLow === 'in progress') return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-600">In Progress</span>;
    if (sLow === 'resolved') return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-600">Resolved</span>;
    return <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-600">{s || 'Open'}</span>;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-800">
      <div className="flex justify-between items-end mb-8">
        <div>
          <button onClick={() => navigate('/maintenance/admin')} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center gap-1">
            &larr; Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Manage Ticket</h1>
          <p className="text-gray-500">Ticket ID: <span className="font-semibold text-[#053769]">{formatTicketId(ticket.id)}</span></p>
        </div>
        
        <div className="bg-yellow-100/50 border border-yellow-200 px-6 py-3 rounded-xl flex items-center gap-3">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Time Elapsed</div>
            <div className="text-xl font-bold text-yellow-700 leading-none mt-1">42h</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-lg font-bold mb-6">Ticket Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8 border-b border-gray-100 pb-8">
              <div>
                <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><span className="text-gray-400"></span> Resource/Location</p>
                <p className="font-semibold">{ticket.resourceLocation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><span className="text-gray-400"></span> Category</p>
                <p className="font-semibold">{ticket.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><span className="text-gray-400"></span> Priority</p>
                <div className="mt-1">{renderPriorityBadge(ticket.priority)}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><span className="text-gray-400"></span> Status</p>
                <div className="mt-1">{renderStatusBadge(ticket.status)}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><span className="text-gray-400"></span> Reported By</p>
                <p className="font-semibold">{ticket.userId || 'Student'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 inline-flex items-center gap-1"><span className="text-gray-400"></span> Contact</p>
                <p className="font-semibold text-blue-600">{ticket.contactDetails}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed text-sm">{ticket.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Attachments</h2>
            {attachments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map((image, index) => (
                  <img
                    key={`${ticket.id}-admin-image-${index}`}
                    src={image}
                    alt={`Ticket attachment ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    className="w-full h-40 rounded-xl object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition"
                  />
                ))}
              </div>
            ) : (
              <div className="h-40 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                No attachments were submitted for this ticket.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-lg font-bold mb-6 inline-flex items-center gap-2"><span className="text-gray-400"></span> Comments & Updates</h2>
            
            <div className="space-y-4 mb-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {comments.length > 0 ? comments.map((comment, index) => (
                <div key={`${comment.timestamp || index}-${index}`} className="relative flex items-start gap-4">
                  <div className="absolute left-0 h-full w-0.5 bg-gray-200"></div>
                  <div className="z-10 w-1 h-1 mt-3 bg-[#053769] rounded-full ring-4 ring-white shadow"></div>
                  <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-800">{comment.authorName}</span>
                        <span className="text-xs text-gray-400 ml-2">({comment.authorRole})</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-400">No comments have been posted yet.</div>
              )}
            </div>

            <textarea 
              placeholder="Add a comment or update..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#053769] mb-4"
              rows="3"
            ></textarea>
            <button onClick={handlePostComment} className="bg-[#053769] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#042d55] transition">Post Comment</button>
          </div>

          {ticket.resolutionNotes && (
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Resolution Notes</h2>
              <p className="text-sm text-gray-500 mb-4">Information recorded by the technician when the work was completed.</p>
              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <p className="text-sm leading-relaxed text-gray-700">{ticket.resolutionNotes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold mb-6">Actions Panel</h2>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-2">Assign to Technician</label>
              <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#053769]">
                <option value="">Unassigned</option>
                <option value="Mike Johnson">Mike Johnson (Electrician)</option>
                <option value="Sarah Williams">Sarah Williams (IT Support)</option>
                <option value="David Brown">David Brown (Plumber)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-2">Update Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#053769]">
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-700 mb-2">Update Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#053769]">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button onClick={handleSaveChanges} className="w-full bg-[#053769] text-white py-3 rounded-xl font-bold hover:bg-[#042d55] transition mb-3">
              Save Changes
            </button>
            <button onClick={handleReject} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Reject Ticket
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Ticket Timeline</h2>
            <div className="text-sm">
              <p className="text-gray-400 text-xs mb-1">Created</p>
              <p className="font-semibold text-gray-700 mb-4">
                {new Date(ticket.createdDate || Date.now()).toLocaleString()}
              </p>
              <p className="text-gray-400 text-xs mb-1">Assigned Technician</p>
              <p className="font-semibold text-gray-700">
                {ticket.assignee || 'Not assigned yet'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Work Progress</h2>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-gray-500">Completion</span>
              <span className="text-sm font-bold text-orange-500">{workProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
              <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${workProgress}%` }} />
            </div>
            <p className="text-xs text-gray-400">
              {ticket.assignee
                ? `Current completion reported by ${ticket.assignee}.`
                : 'This ticket has not been assigned to a technician yet.'}
            </p>
          </div>
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

export default AdminTicketManagementPage;
