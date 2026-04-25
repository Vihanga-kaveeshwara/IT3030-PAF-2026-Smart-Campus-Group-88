import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../booking/BookingContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiUsers, FiTarget, FiUser, FiCheckCircle, FiXCircle, FiSettings, FiAlertCircle, FiLoader } from 'react-icons/fi';

const AdminBookingManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, getBooking, approveBooking, rejectBooking } = useContext(BookingContext);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);
    getBooking(id).finally(() => setPageLoading(false));
  }, [id, getBooking]);

  const booking = state.currentBooking;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-700 border-green-300',
      PENDING: 'bg-blue-100 text-blue-700 border-blue-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300',
      CANCELLED: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[status] || 'bg-purple-100 text-purple-700 border-purple-300';
  };

  const getFacilityName = (resourceId) => {
    const facility = state.facilities.find(f => f.id === resourceId);
    return facility ? facility.name : resourceId;
  };

  const handleApprove = async () => {
    if (window.confirm('Approve this booking?')) {
      setActionLoading(true);
      try {
        await approveBooking(id);
        alert('✅ Booking approved successfully');
        navigate('/admin/booking/all');
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (window.confirm('Reject this booking?')) {
      setActionLoading(true);
      try {
        await rejectBooking(id, rejectionReason);
        alert('✅ Booking rejected successfully');
        navigate('/admin/booking/all');
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setActionLoading(false);
        setRejectionReason('');
        setShowRejectForm(false);
      }
    }
  };

  if (pageLoading || state.loading) {
    return (
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
        Loading booking details...
      </div>
    );
  }

  if (!booking || booking.id !== id) {
    return (
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
        Booking not found
      </div>
    );
  }

  const canApprove = booking.status === 'PENDING';
  const canReject = booking.status === 'PENDING';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => navigate('/admin/booking/all')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            padding: '12px 20px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#053769',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f5f9';
            e.target.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <FiArrowLeft size={20} />
          Back to Admin Bookings
        </button>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '32px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div>
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
                Booking Management
              </h1>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                Booking ID: <span style={{
                  fontFamily: 'monospace',
                  fontWeight: '500',
                  backgroundColor: '#f3f4f6',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>{booking.id}</span>
              </p>
            </div>
            <div style={{
              padding: '12px 24px',
              borderRadius: '24px',
              border: '2px solid',
              fontWeight: '700',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              ...(booking.status === 'APPROVED' && {
                backgroundColor: '#10b981',
                borderColor: '#059669',
                color: '#ffffff'
              }),
              ...(booking.status === 'PENDING' && {
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                color: '#ffffff'
              }),
              ...(booking.status === 'REJECTED' && {
                backgroundColor: '#ef4444',
                borderColor: '#dc2626',
                color: '#ffffff'
              }),
              ...(booking.status === 'CANCELLED' && {
                backgroundColor: '#6b7280',
                borderColor: '#4b5563',
                color: '#ffffff'
              }),
              ...(booking.status !== 'APPROVED' && booking.status !== 'PENDING' && booking.status !== 'REJECTED' && booking.status !== 'CANCELLED' && {
                backgroundColor: '#8b5cf6',
                borderColor: '#7c3aed',
                color: '#ffffff'
              })
            }}>
              {booking.status === 'APPROVED' && <FiCheckCircle size={20} />}
              {booking.status === 'PENDING' && <FiClock size={20} />}
              {booking.status === 'REJECTED' && <FiXCircle size={20} />}
              {booking.status === 'CANCELLED' && <FiXCircle size={20} />}
              {booking.status !== 'APPROVED' && booking.status !== 'PENDING' && booking.status !== 'REJECTED' && booking.status !== 'CANCELLED' && <FiAlertCircle size={20} />}
              {booking.status}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiTarget size={14} />
                  Facility
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>{getFacilityName(booking.resourceId)}</p>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiCalendar size={14} />
                  Date
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>{formatDate(booking.date)}</p>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiClock size={14} />
                  Time Slot
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </p>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiUsers size={14} />
                  Expected Attendees
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>{booking.expectedAttendees} people</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiTarget size={14} />
                  Purpose
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>{booking.purpose}</p>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiUser size={14} />
                  Requester ID
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>{booking.requesterId}</p>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FiCalendar size={14} />
                  Created On
                </div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>{formatDateTime(booking.createdAt)}</p>
              </div>

              {booking.status === 'REJECTED' && booking.rejectionReason && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#dc2626',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <FiXCircle size={14} />
                    Rejection Reason
                  </div>
                  <p style={{
                    color: '#374151',
                    marginTop: '8px',
                    fontSize: '16px',
                    lineHeight: '1.5'
                  }}>{booking.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {showRejectForm && canReject && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#991b1b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiXCircle size={24} />
                Reject Booking
              </h3>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  placeholder="Explain why this booking is being rejected..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                  onBlur={(e) => e.target.style.borderColor = '#fca5a5'}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: actionLoading || !rejectionReason.trim() ? '#fca5a5' : '#dc2626',
                    color: '#ffffff',
                    fontWeight: '500',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: actionLoading || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {actionLoading ? (
                    <>
                      <FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FiXCircle size={16} />
                      Confirm Rejection
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: '#d1d5db',
                    color: '#374151',
                    fontWeight: '500',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#9ca3af'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#d1d5db'}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            {canApprove && (
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  backgroundColor: actionLoading ? '#86efac' : '#10b981',
                  color: '#ffffff',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading) e.target.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  if (!actionLoading) e.target.style.backgroundColor = '#10b981';
                }}
              >
                {actionLoading ? (
                  <>
                    <FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Approving...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={16} />
                    Approve Booking
                  </>
                )}
              </button>
            )}

            {canReject && !showRejectForm && (
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  backgroundColor: actionLoading ? '#fca5a5' : '#dc2626',
                  color: '#ffffff',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading) e.target.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  if (!actionLoading) e.target.style.backgroundColor = '#dc2626';
                }}
              >
                <FiXCircle size={16} />
                Reject Booking
              </button>
            )}

            {!canApprove && !canReject && (
              <div style={{
                flex: 1,
                padding: '16px 24px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontWeight: '500',
                borderRadius: '8px',
                fontSize: '16px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <FiAlertCircle size={16} />
                No actions available for {booking.status} bookings
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingManagementPage;
