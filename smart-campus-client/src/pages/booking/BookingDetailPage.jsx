import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from './BookingContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUsers, FiFileText, FiUser, FiCheckCircle, FiXCircle, FiAlertCircle, FiGrid, FiLoader, FiX } from 'react-icons/fi';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, getBooking, cancelBooking } = useContext(BookingContext);
  const [cancelling, setCancelling] = useState(false);
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

  const goBackToMyBookings = (requesterId) => {
    navigate(`/booking/my-bookings?requesterId=${encodeURIComponent(requesterId)}`);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancelling(true);
      try {
        await cancelBooking(id);
        alert('✅ Booking cancelled successfully');
        goBackToMyBookings(booking.requesterId);
      } catch (err) {
        alert(`❌ Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setCancelling(false);
      }
    }
  };

  if (pageLoading || state.loading) {
    return (
      <div style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)'
        }}>
          <FiGrid style={{
            fontSize: '2.5rem',
            color: '#3b82f6',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: '500'
          }}>Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!booking || booking.id !== id) {
    return (
      <div style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)'
        }}>
          <FiXCircle style={{ fontSize: '2.5rem', color: '#ef4444' }} />
          <span style={{
            color: '#dc2626',
            fontSize: '1rem',
            fontWeight: '500'
          }}>Booking not found</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => goBackToMyBookings(booking.requesterId)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#053769',
            fontWeight: '600',
            borderRadius: '0.5rem',
            border: '1px solid rgba(5, 55, 105, 0.1)',
            textDecoration: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(5, 55, 105, 0.05)';
            e.target.style.transform = 'translateX(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
            e.target.style.transform = 'translateX(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
          }}
        >
          <FiArrowLeft style={{ fontSize: '1rem' }} />
          Back to My Bookings
        </button>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          padding: '2.5rem'
        }}>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid #f1f5f9'
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
              }}>Booking Details</h1>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Booking ID: <span style={{
                  fontFamily: 'monospace',
                  fontWeight: '600',
                  color: '#334155',
                  background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{booking.id}</span>
              </p>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: '2px solid',
              fontWeight: '700',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: booking.status === 'APPROVED' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' :
                         booking.status === 'PENDING' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                         booking.status === 'REJECTED' ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' :
                         booking.status === 'CANCELLED' ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' :
                         'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              borderColor: booking.status === 'APPROVED' ? '#22c55e' :
                          booking.status === 'PENDING' ? '#3b82f6' :
                          booking.status === 'REJECTED' ? '#ef4444' :
                          booking.status === 'CANCELLED' ? '#9ca3af' :
                          '#8b5cf6',
              color: booking.status === 'APPROVED' ? '#166534' :
                     booking.status === 'PENDING' ? '#1d4ed8' :
                     booking.status === 'REJECTED' ? '#dc2626' :
                     booking.status === 'CANCELLED' ? '#374151' :
                     '#7c3aed',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {booking.status === 'APPROVED' && <FiCheckCircle style={{ fontSize: '1rem' }} />}
              {booking.status === 'PENDING' && <FiAlertCircle style={{ fontSize: '1rem' }} />}
              {booking.status === 'REJECTED' && <FiXCircle style={{ fontSize: '1rem' }} />}
              {booking.status === 'CANCELLED' && <FiXCircle style={{ fontSize: '1rem' }} />}
              {booking.status}
            </div>
          </div>

        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiMapPin style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Facility</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>
                  {state.facilities.find(f => f.id === booking.resourceId)?.name || booking.resourceId}
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiCalendar style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Date</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>{formatDate(booking.date)}</p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiClock style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Time Slot</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiUsers style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Expected Attendees</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>{booking.expectedAttendees} people</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiFileText style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Purpose</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>{booking.purpose}</p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiUser style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Requester ID</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>{booking.requesterId}</p>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <FiCalendar style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Created On</p>
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginTop: '0.25rem'
                }}>{formatDateTime(booking.createdAt)}</p>
              </div>

              {booking.status === 'REJECTED' && booking.rejectionReason && (
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  borderRadius: '1rem',
                  border: '1px solid #fecaca'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <FiXCircle style={{ fontSize: '1.25rem', color: '#ef4444' }} />
                    <p style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#dc2626',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Rejection Reason</p>
                  </div>
                  <p style={{
                    color: '#7f1d1d',
                    marginTop: '0.5rem',
                    lineHeight: '1.5'
                  }}>{booking.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

        {booking.status === 'APPROVED' && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #f1f5f9'
          }}>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                flex: 1,
                padding: '0.875rem 2rem',
                background: cancelling ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#ffffff',
                fontWeight: '600',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: cancelling ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)',
                opacity: cancelling ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!cancelling) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 12px rgba(220, 38, 38, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!cancelling) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.2)';
                }
              }}
            >
              {cancelling ? (
                <>
                  <FiLoader style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }} />
                  Cancelling...
                </>
              ) : (
                <>
                  <FiX style={{ fontSize: '1rem' }} />
                  Cancel Booking
                </>
              )}
            </button>
          </div>
        )}

        {booking.status === 'PENDING' && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #f1f5f9'
          }}>
            <div style={{
              flex: 1,
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '1px solid #93c5fd',
              borderRadius: '0.75rem',
              textAlign: 'center',
              color: '#1d4ed8',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}>
              <FiAlertCircle style={{ fontSize: '1rem' }} />
              Awaiting Admin Approval
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
