import React, { useContext } from 'react';
import { TicketContext } from './TicketContext';
import { Link } from 'react-router-dom';
import { formatTicketIdForUser } from './ticketIdFormatter';
import { FiPlus, FiEye, FiMapPin, FiTool, FiAlertCircle, FiClock, FiCalendar, FiGrid, FiXCircle } from 'react-icons/fi';

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
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '2rem',
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#1e293b',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>My Tickets</h1>
                        <p style={{
                            color: '#64748b',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}>
                            View and track all your submitted maintenance requests
                        </p>
                    </div>
                    <Link
                        to="/maintenance/report"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 2rem',
                            background: 'linear-gradient(135deg, #053769 0%, #0f172a 100%)',
                            color: '#ffffff',
                            fontWeight: '600',
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 6px rgba(5, 55, 105, 0.2)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 12px rgba(5, 55, 105, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 6px rgba(5, 55, 105, 0.2)';
                        }}
                    >
                        <FiPlus style={{ fontSize: '1.25rem' }} />
                        Add Ticket
                    </Link>
                </div>

                {/* Table */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: '0',
                        fontSize: '0.875rem',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
                    }}>
                        <thead style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            borderBottom: '3px solid #3b82f6',
                            position: 'sticky',
                            top: 0,
                            zIndex: 20
                        }}>
                            <tr>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            color: '#60a5fa',
                                            fontSize: '0.9rem',
                                            fontWeight: '800'
                                        }}>#</span>
                                        ID
                                    </div>
                                </th>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiMapPin style={{ color: '#60a5fa', fontSize: '1rem' }} />
                                        LOCATION
                                    </div>
                                </th>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiTool style={{ color: '#60a5fa', fontSize: '1rem' }} />
                                        CATEGORY
                                    </div>
                                </th>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiAlertCircle style={{ color: '#60a5fa', fontSize: '1rem' }} />
                                        PRIORITY
                                    </div>
                                </th>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiClock style={{ color: '#60a5fa', fontSize: '1rem' }} />
                                        STATUS
                                    </div>
                                </th>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'left',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiCalendar style={{ color: '#60a5fa', fontSize: '1rem' }} />
                                        CREATED
                                    </div>
                                </th>
                                <th style={{
                                    padding: '1.5rem 1.25rem',
                                    textAlign: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiEye style={{ color: '#60a5fa', fontSize: '1rem' }} />
                                        ACTION
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{
                            background: '#ffffff'
                        }}>
                            {loading && (
                                <tr>
                                    <td colSpan="7" style={{
                                        textAlign: 'center',
                                        padding: '4rem 2rem',
                                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                        borderBottom: 'none'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1.5rem'
                                        }}>
                                            <div style={{
                                                position: 'relative',
                                                width: '4rem',
                                                height: '4rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                borderRadius: '50%',
                                                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                                            }}>
                                                <FiGrid style={{
                                                    fontSize: '2rem',
                                                    color: '#ffffff',
                                                    animation: 'spin 1.5s linear infinite'
                                                }} />
                                            </div>
                                            <div>
                                                <span style={{
                                                    color: '#1e40af',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    display: 'block',
                                                    marginBottom: '0.5rem'
                                                }}>Loading Tickets</span>
                                                <span style={{
                                                    color: '#64748b',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '400'
                                                }}>Please wait while we fetch your data...</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan="7" style={{
                                        textAlign: 'center',
                                        padding: '4rem 2rem',
                                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                        borderBottom: 'none'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1.5rem'
                                        }}>
                                            <div style={{
                                                position: 'relative',
                                                width: '4rem',
                                                height: '4rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                borderRadius: '50%',
                                                boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)'
                                            }}>
                                                <FiXCircle style={{ fontSize: '2rem', color: '#ffffff' }} />
                                            </div>
                                            <div>
                                                <span style={{
                                                    color: '#dc2626',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    display: 'block',
                                                    marginBottom: '0.5rem'
                                                }}>Error Loading Tickets</span>
                                                <span style={{
                                                    color: '#7f1d1d',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '400'
                                                }}>{error}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && tickets.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{
                                        textAlign: 'center',
                                        padding: '4rem 2rem',
                                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                        borderBottom: 'none'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1.5rem'
                                        }}>
                                            <div style={{
                                                position: 'relative',
                                                width: '4rem',
                                                height: '4rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                borderRadius: '50%',
                                                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                                            }}>
                                                <FiCalendar style={{ fontSize: '2rem', color: '#ffffff' }} />
                                            </div>
                                            <div>
                                                <span style={{
                                                    color: '#059669',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    display: 'block',
                                                    marginBottom: '0.5rem'
                                                }}>No Tickets Found</span>
                                                <span style={{
                                                    color: '#64748b',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '400'
                                                }}>Create your first ticket to get started!</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && tickets.map((ticket, index) => (
                                <tr key={ticket.id} style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'all 0.2s ease',
                                    background: index % 2 === 0 ? '#ffffff' : '#fafbfc'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                                        e.currentTarget.style.transform = 'translateX(2px)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fafbfc';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}>
                                    <td style={{
                                        padding: '1.25rem 1.5rem',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        borderRadius: '0.375rem',
                                        margin: '0.5rem 1.5rem 0.5rem 1.5rem',
                                        padding: '0.5rem 0.75rem',
                                        textAlign: 'center'
                                    }}>{formatTicketIdForUser(ticket.id)}</td>
                                    <td style={{
                                        padding: '1.25rem 1.5rem',
                                        color: '#374151',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>{ticket.resourceLocation}</td>
                                    <td style={{
                                        padding: '1.25rem 1.5rem',
                                        color: '#374151',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>{ticket.category}</td>
                                    <td style={{
                                        padding: '1.25rem 1.5rem'
                                    }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.375rem 0.875rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            background: ticket.priority === 'High' ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' :
                                                       ticket.priority === 'Medium' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                                                       'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                            color: ticket.priority === 'High' ? '#dc2626' :
                                                   ticket.priority === 'Medium' ? '#d97706' :
                                                   '#166534',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td style={{
                                        padding: '1.25rem 1.5rem'
                                    }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.375rem 0.875rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            background: ticket.status === 'In Progress' ? 'linear-gradient(135deg, #fed7aa 0%, #fbbf24 100%)' :
                                                       ticket.status === 'Open' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                                                       ticket.status === 'Resolved' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' :
                                                       'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                                            color: ticket.status === 'In Progress' ? '#d97706' :
                                                   ticket.status === 'Open' ? '#1d4ed8' :
                                                   ticket.status === 'Resolved' ? '#166534' :
                                                   '#7c3aed',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td style={{
                                        padding: '1.25rem 1.5rem',
                                        color: '#374151',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}>{formatDate(ticket.createdDate)}</td>
                                    <td style={{
                                        padding: '1.25rem 1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <Link
                                            to={`/maintenance/ticket/${ticket.id}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 1rem',
                                                background: 'linear-gradient(135deg, #053769 0%, #0f172a 100%)',
                                                color: '#ffffff',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                borderRadius: '0.5rem',
                                                textDecoration: 'none',
                                                boxShadow: '0 2px 4px rgba(5, 55, 105, 0.2)',
                                                transition: 'all 0.2s ease',
                                                border: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 4px 8px rgba(5, 55, 105, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 2px 4px rgba(5, 55, 105, 0.2)';
                                            }}
                                        >
                                            <FiEye style={{ fontSize: '0.875rem' }} />
                                            View
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