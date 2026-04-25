import React, { useContext, useEffect, useState } from 'react';
import { TicketContext } from '../../features/maintenance/TicketContext';
import { Link } from 'react-router-dom';
import { FiFilter, FiX, FiEye, FiUser, FiClock, FiAlertCircle, FiCheckCircle, FiPlay, FiLoader, FiSearch, FiTool, FiCalendar, FiTag, FiTrendingUp } from 'react-icons/fi';

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiTool size={36} style={{ color: '#1f2937' }} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>All Tickets Management</h1>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <FiFilter size={20} style={{ color: '#1f2937' }} />
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>Filters</h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>Priority</label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>Assignee</label>
              <input
                type="text"
                name="assignee"
                value={filters.assignee}
                onChange={handleFilterChange}
                placeholder="Technician name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#d1d5db',
              color: '#374151',
              fontWeight: '500',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#9ca3af'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d1d5db'}
          >
            <FiX size={16} />
            Clear Filters
          </button>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiSearch size={14} />
                      TICKET ID
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>TITLE</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiTag size={14} />
                      CATEGORY
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiTrendingUp size={14} />
                      PRIORITY
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiUser size={14} />
                      REPORTER
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiUser size={14} />
                      ASSIGNEE
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>STATUS</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiCalendar size={14} />
                      CREATED
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="9" style={{
                      textAlign: 'center',
                      padding: '32px',
                      color: '#6b7280',
                      fontSize: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <FiLoader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Loading...
                      </div>
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="9" style={{
                      textAlign: 'center',
                      padding: '32px',
                      color: '#ef4444',
                      fontSize: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <FiAlertCircle size={20} />
                        Error: {error}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{
                      textAlign: 'center',
                      padding: '32px',
                      color: '#6b7280',
                      fontSize: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <FiSearch size={20} />
                        No tickets found
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredTickets.map((ticket) => (
                  <tr key={ticket.id} style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td style={{
                      padding: '16px 20px',
                      fontWeight: '500',
                      color: '#1f2937',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      backgroundColor: '#f8fafc',
                      borderRadius: '4px',
                      margin: '4px 0'
                    }}>{ticket.id || 'N/A'}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }} title={ticket.title}>
                      {ticket.title}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{ticket.category || 'N/A'}</td>
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid',
                        ...(ticket.priority === 'HIGH' && {
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          borderColor: '#fecaca'
                        }),
                        ...(ticket.priority === 'MEDIUM' && {
                          backgroundColor: '#fff7ed',
                          color: '#ea580c',
                          borderColor: '#fed7aa'
                        }),
                        ...(ticket.priority === 'LOW' && {
                          backgroundColor: '#f0fdf4',
                          color: '#16a34a',
                          borderColor: '#bbf7d0'
                        }),
                        ...(ticket.priority !== 'HIGH' && ticket.priority !== 'MEDIUM' && ticket.priority !== 'LOW' && {
                          backgroundColor: '#f9fafb',
                          color: '#6b7280',
                          borderColor: '#d1d5db'
                        })
                      }}>
                        {ticket.priority === 'HIGH' && <FiAlertCircle size={12} />}
                        {ticket.priority === 'MEDIUM' && <FiAlertCircle size={12} />}
                        {ticket.priority === 'LOW' && <FiCheckCircle size={12} />}
                        {ticket.priority !== 'HIGH' && ticket.priority !== 'MEDIUM' && ticket.priority !== 'LOW' && <FiClock size={12} />}
                        {ticket.priority}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{ticket.reporterId || 'N/A'}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{ticket.assignee || 'Unassigned'}</td>
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        ...(ticket.status === 'OPEN' && {
                          backgroundColor: '#3b82f6',
                          color: '#ffffff'
                        }),
                        ...(ticket.status === 'IN_PROGRESS' && {
                          backgroundColor: '#f59e0b',
                          color: '#ffffff'
                        }),
                        ...(ticket.status === 'RESOLVED' && {
                          backgroundColor: '#10b981',
                          color: '#ffffff'
                        }),
                        ...(ticket.status === 'CLOSED' && {
                          backgroundColor: '#6b7280',
                          color: '#ffffff'
                        }),
                        ...(ticket.status === 'REJECTED' && {
                          backgroundColor: '#ef4444',
                          color: '#ffffff'
                        }),
                        ...(ticket.status !== 'OPEN' && ticket.status !== 'IN_PROGRESS' && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && {
                          backgroundColor: '#8b5cf6',
                          color: '#ffffff'
                        })
                      }}>
                        {ticket.status === 'OPEN' && <FiClock size={12} />}
                        {ticket.status === 'IN_PROGRESS' && <FiPlay size={12} />}
                        {ticket.status === 'RESOLVED' && <FiCheckCircle size={12} />}
                        {ticket.status === 'CLOSED' && <FiCheckCircle size={12} />}
                        {ticket.status === 'REJECTED' && <FiX size={12} />}
                        {ticket.status !== 'OPEN' && ticket.status !== 'IN_PROGRESS' && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && <FiAlertCircle size={12} />}
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{formatDate(ticket.createdAt)}</td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <Link
                          to={`/admin/maintenance/ticket/${ticket.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '500',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2563eb';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#3b82f6';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <FiEye size={12} />
                          View
                        </Link>
                        
                        {ticket.status === 'OPEN' && !ticket.assignee && (
                          <button
                            onClick={() => handleAssignTicket(ticket.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: '#8b5cf6',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#7c3aed';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#8b5cf6';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <FiUser size={12} />
                            Assign
                          </button>
                        )}
                        
                        {ticket.status === 'OPEN' && (
                          <button
                            onClick={() => handleRejectTicket(ticket.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: '#ef4444',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#dc2626';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#ef4444';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <FiX size={12} />
                            Reject
                          </button>
                        )}
                        
                        {ticket.status === 'OPEN' && ticket.assignee && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'IN_PROGRESS')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: '#f59e0b',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#d97706';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#f59e0b';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <FiPlay size={12} />
                            Start
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
    </div>
  );
};

export default AllTicketsPage;
