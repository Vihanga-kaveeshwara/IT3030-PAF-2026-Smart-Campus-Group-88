import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../booking/BookingContext';
import { Link } from 'react-router-dom';
import { FiFilter, FiX, FiCalendar, FiClock, FiTarget, FiUser, FiCheckCircle, FiClock as FiPending, FiXCircle, FiSettings, FiLoader, FiAlertCircle, FiSearch } from 'react-icons/fi';

const AdminBookingsPage = () => {
  const { state, fetchAllBookings } = useContext(BookingContext);
  const { allBookings, loading, error } = state;

  const [filters, setFilters] = useState({
    status: '',
    resourceId: '',
    requesterId: '',
    fromDate: '',
    toDate: ''
  });

  // Debounced filters: only update after 500ms of no changes to avoid
  // firing an API call on every keystroke in the text inputs.
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  useEffect(() => {
    fetchAllBookings(debouncedFilters);
  }, [debouncedFilters, fetchAllBookings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: '', resourceId: '', requesterId: '', fromDate: '', toDate: '' });
  };

  const getStatusColor = (status) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-700';
    if (status === 'PENDING') return 'bg-blue-100 text-blue-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    if (status === 'CANCELLED') return 'bg-gray-100 text-gray-700';
    return 'bg-purple-100 text-purple-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const getFacilityName = (resourceId) => {
    const facility = state.facilities.find(f => f.id === resourceId);
    return facility ? facility.name : resourceId;
  };

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
          <FiSettings size={36} style={{ color: '#1f2937' }} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0
          }}>All Bookings Management</h1>
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
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
              }}>Facility ID</label>
              <input
                type="text"
                name="resourceId"
                value={filters.resourceId}
                onChange={handleFilterChange}
                placeholder="Facility ID"
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

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>Requester</label>
              <input
                type="text"
                name="requesterId"
                value={filters.requesterId}
                onChange={handleFilterChange}
                placeholder="User ID"
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

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
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
              />
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
              }}>To Date</label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
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
                      BOOKING ID
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
                      <FiTarget size={14} />
                      FACILITY
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
                      REQUESTER
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
                      <FiCalendar size={14} />
                      DATE
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
                      <FiClock size={14} />
                      TIME
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
                      <FiTarget size={14} />
                      PURPOSE
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
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="8" style={{
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
                    <td colSpan="8" style={{
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
                {!loading && !error && allBookings.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{
                      textAlign: 'center',
                      padding: '32px',
                      color: '#6b7280',
                      fontSize: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <FiSearch size={20} />
                        No bookings found
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && !error && allBookings.map((booking) => (
                  <tr key={booking.id} style={{
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
                    }}>{booking.id || 'N/A'}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{getFacilityName(booking.resourceId)}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{booking.requesterId}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>{formatDate(booking.date)}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151',
                      fontSize: '14px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{booking.purpose}</td>
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
                        ...(booking.status === 'APPROVED' && {
                          backgroundColor: '#10b981',
                          color: '#ffffff'
                        }),
                        ...(booking.status === 'PENDING' && {
                          backgroundColor: '#3b82f6',
                          color: '#ffffff'
                        }),
                        ...(booking.status === 'REJECTED' && {
                          backgroundColor: '#ef4444',
                          color: '#ffffff'
                        }),
                        ...(booking.status === 'CANCELLED' && {
                          backgroundColor: '#6b7280',
                          color: '#ffffff'
                        }),
                        ...(booking.status !== 'APPROVED' && booking.status !== 'PENDING' && booking.status !== 'REJECTED' && booking.status !== 'CANCELLED' && {
                          backgroundColor: '#8b5cf6',
                          color: '#ffffff'
                        })
                      }}>
                        {booking.status === 'APPROVED' && <FiCheckCircle size={12} />}
                        {booking.status === 'PENDING' && <FiPending size={12} />}
                        {booking.status === 'REJECTED' && <FiXCircle size={12} />}
                        {booking.status === 'CANCELLED' && <FiXCircle size={12} />}
                        {booking.status !== 'APPROVED' && booking.status !== 'PENDING' && booking.status !== 'REJECTED' && booking.status !== 'CANCELLED' && <FiAlertCircle size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <Link
                        to={`/admin/booking/manage/${booking.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          backgroundColor: '#053769',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#042d55';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#053769';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <FiSettings size={14} />
                        Manage
                      </Link>
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

export default AdminBookingsPage;
