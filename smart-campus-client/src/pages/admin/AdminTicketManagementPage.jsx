import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketContext } from '../../features/maintenance/TicketContext';
import { formatTicketId } from '../../features/maintenance/ticketIdFormatter';
import { FiArrowLeft, FiClock, FiAlertCircle, FiCheckCircle, FiXCircle, FiSettings, FiLoader, FiUser, FiMapPin, FiTag, FiTrendingUp, FiMessageSquare, FiPaperclip, FiX, FiSave, FiTool, FiCalendar } from 'react-icons/fi';

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

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px',
      fontSize: '16px',
      color: '#6b7280'
    }}>
      <FiLoader size={32} style={{ animation: 'spin 1s linear infinite' }} />
      Loading ticket...
    </div>
  );
  if (!ticket || fetchingError) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px',
      fontSize: '16px',
      color: '#ef4444'
    }}>
      <FiAlertCircle size={48} />
      {fetchingError || 'Ticket not found'}
    </div>
  );

  const attachments = Array.isArray(ticket.images) ? ticket.images : [];
  const comments = Array.isArray(ticket.comments) ? ticket.comments : [];
  const workProgress = ticket.status?.toLowerCase() === 'resolved' ? 100 : (ticket.workProgress ?? 0);

  const renderPriorityBadge = (p) => {
    const pLow = p?.toLowerCase() || '';
    if (pLow === 'high') return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#fef2f2',
        color: '#dc2626'
      }}>
        <FiAlertCircle size={12} />
        High
      </span>
    );
    if (pLow === 'medium') return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#fef3c7',
        color: '#d97706'
      }}>
        <FiAlertCircle size={12} />
        Medium
      </span>
    );
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#f0fdf4',
        color: '#16a34a'
      }}>
        <FiCheckCircle size={12} />
        Low
      </span>
    );
  };

  const renderStatusBadge = (s) => {
    const sLow = s?.toLowerCase() || '';
    if (sLow === 'in progress') return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#fed7aa',
        color: '#ea580c'
      }}>
        <FiClock size={12} />
        In Progress
      </span>
    );
    if (sLow === 'resolved') return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#bbf7d0',
        color: '#16a34a'
      }}>
        <FiCheckCircle size={12} />
        Resolved
      </span>
    );
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: '#dbeafe',
        color: '#2563eb'
      }}>
        <FiClock size={12} />
        {s || 'Open'}
      </span>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        color: '#1f2937'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px'
        }}>
          <div>
            <button
              onClick={() => navigate('/maintenance/admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#eff6ff';
                e.target.style.color = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#3b82f6';
              }}
            >
              <FiArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FiSettings size={32} />
              Manage Ticket
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              Ticket ID: <span style={{
                fontWeight: '600',
                color: '#053769',
                backgroundColor: '#f0f9ff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>{formatTicketId(ticket.id)}</span>
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            padding: '16px 24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FiClock size={24} style={{ color: '#d97706' }} />
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                lineHeight: '1'
              }}>Time Elapsed</div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#d97706',
                lineHeight: '1',
                marginTop: '4px'
              }}>42h</div>
            </div>
          </div>
        </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '32px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiTool size={20} />
              Ticket Information
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '32px',
              paddingBottom: '32px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiMapPin size={14} style={{ color: '#9ca3af' }} />
                  Resource/Location
                </p>
                <p style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#1f2937'
                }}>{ticket.resourceLocation}</p>
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiTag size={14} style={{ color: '#9ca3af' }} />
                  Category
                </p>
                <p style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#1f2937'
                }}>{ticket.category}</p>
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiTrendingUp size={14} style={{ color: '#9ca3af' }} />
                  Priority
                </p>
                <div style={{ marginTop: '4px' }}>{renderPriorityBadge(ticket.priority)}</div>
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiAlertCircle size={14} style={{ color: '#9ca3af' }} />
                  Status
                </p>
                <div style={{ marginTop: '4px' }}>{renderStatusBadge(ticket.status)}</div>
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiUser size={14} style={{ color: '#9ca3af' }} />
                  Reported By
                </p>
                <p style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#1f2937'
                }}>{ticket.userId || 'Student'}</p>
              </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiUser size={14} style={{ color: '#9ca3af' }} />
                  Contact
                </p>
                <p style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#2563eb'
                }}>{ticket.contactDetails}</p>
              </div>
            </div>
            
            <div>
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '8px'
              }}>Description</p>
              <p style={{
                color: '#374151',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>{ticket.description}</p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '32px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiPaperclip size={20} />
              Attachments
            </h2>
            {attachments.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                {attachments.map((image, index) => (
                  <img
                    key={`${ticket.id}-admin-image-${index}`}
                    src={image}
                    alt={`Ticket attachment ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                height: '160px',
                borderRadius: '12px',
                border: '2px dashed #d1d5db',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#9ca3af'
              }}>
                <FiPaperclip size={24} style={{ marginRight: '8px' }} />
                No attachments were submitted for this ticket.
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '32px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiMessageSquare size={20} />
              Comments & Updates
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '24px',
              position: 'relative'
            }}>
              {comments.length > 0 ? comments.map((comment, index) => (
                <div key={`${comment.timestamp || index}-${index}`} style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    height: '100%',
                    width: '2px',
                    backgroundColor: '#e5e7eb'
                  }}></div>
                  <div style={{
                    zIndex: '10',
                    width: '4px',
                    height: '4px',
                    marginTop: '12px',
                    backgroundColor: '#053769',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.8)'
                  }}></div>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '12px',
                    flex: '1',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <span style={{
                          fontWeight: '700',
                          color: '#1f2937'
                        }}>{comment.authorName}</span>
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginLeft: '8px'
                        }}>({comment.authorRole})</span>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5'
                    }}>{comment.content}</p>
                  </div>
                </div>
              )) : (
                <div style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  padding: '32px'
                }}>
                  <FiMessageSquare size={32} style={{ marginBottom: '8px' }} />
                  No comments have been posted yet.
                </div>
              )}
            </div>

            <textarea 
              placeholder="Add a comment or update..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '16px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(5, 55, 105, 0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              rows="3"
            ></textarea>
            <button 
              onClick={handlePostComment} 
              style={{
                backgroundColor: '#053769',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#042d55'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#053769'}
            >
              <FiMessageSquare size={16} />
              Post Comment
            </button>
          </div>

          {ticket.resolutionNotes && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '32px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiCheckCircle size={20} style={{ color: '#16a34a' }} />
                Resolution Notes
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '16px'
              }}>Information recorded by technician when work was completed.</p>
              <div style={{
                borderRadius: '16px',
                border: '1px solid #bbf7d0',
                backgroundColor: '#f0fdf4',
                padding: '20px'
              }}>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#374151'
                }}>{ticket.resolutionNotes}</p>
              </div>
            </div>
          )}
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiSettings size={20} />
              Actions Panel
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '8px'
              }}>Assign to Technician</label>
              <select 
                value={assignee} 
                onChange={e => setAssignee(e.target.value)} 
                style={{
                  width: '100%',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(5, 55, 105, 0.2)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              >
                <option value="">Unassigned</option>
                <option value="Mike Johnson">Mike Johnson (Electrician)</option>
                <option value="Sarah Williams">Sarah Williams (IT Support)</option>
                <option value="David Brown">David Brown (Plumber)</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '8px'
              }}>Update Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                style={{
                  width: '100%',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(5, 55, 105, 0.2)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              >
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '8px'
              }}>Update Priority</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value)} 
                style={{
                  width: '100%',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(5, 55, 105, 0.2)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button 
              onClick={handleSaveChanges} 
              style={{
                width: '100%',
                backgroundColor: '#053769',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#042d55'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#053769'}
            >
              <FiSave size={16} />
              Save Changes
            </button>
            <button 
              onClick={handleReject} 
              style={{
                width: '100%',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              <FiXCircle size={16} />
              Reject Ticket
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiCalendar size={20} />
              Ticket Timeline
            </h2>
            <div style={{ fontSize: '14px' }}>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                marginBottom: '4px'
              }}>Created</p>
              <p style={{
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                {new Date(ticket.createdDate || Date.now()).toLocaleString()}
              </p>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                marginBottom: '4px'
              }}>Assigned Technician</p>
              <p style={{
                fontWeight: '600',
                color: '#374151'
              }}>
                {ticket.assignee || 'Not assigned yet'}
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiTrendingUp size={20} />
              Work Progress
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>Completion</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#f97316'
              }}>{workProgress}%</span>
            </div>
            <div style={{
              width: '100%',
              backgroundColor: '#f3f4f6',
              borderRadius: '999px',
              height: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                backgroundColor: '#f97316',
                height: '10px',
                borderRadius: '999px',
                transition: 'all 0.3s ease',
                width: `${workProgress}%`
              }} />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              {ticket.assignee
                ? `Current completion reported by ${ticket.assignee}.`
                : 'This ticket has not been assigned to a technician yet.'
              }
            </p>
          </div>
        </div>
      </div>
      </div>

      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: '50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            cursor: 'zoom-out'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Enlarged view" 
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default AdminTicketManagementPage;
