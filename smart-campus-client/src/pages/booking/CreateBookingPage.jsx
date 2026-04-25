import React, { useState, useContext, useEffect } from 'react';
import { BookingContext, STATIC_USER_ID } from './BookingContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiFileText, FiCheckCircle, FiAlertCircle, FiXCircle, FiSend, FiLoader, FiArrowLeft } from 'react-icons/fi';

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const { state, createBooking, fetchMyBookings } = useContext(BookingContext);
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    resourceId: '',
    requesterId: STATIC_USER_ID,
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto-set requesterId when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setFormData(prev => ({
        ...prev,
        requesterId: user.id
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.resourceId.trim()) newErrors.resourceId = 'Facility is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.expectedAttendees || formData.expectedAttendees < 1) {
      newErrors.expectedAttendees = 'Expected attendees must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        expectedAttendees: parseInt(formData.expectedAttendees)
      };

      const newBooking = await createBooking(bookingData);
      alert(`Booking request submitted successfully! Booking ID: ${newBooking.id}`);
      
      await fetchMyBookings(formData.requesterId);
      navigate(`/booking/my-bookings?requesterId=${encodeURIComponent(formData.requesterId)}`);
      
      setFormData({
        resourceId: '',
        requesterId: user?.id || STATIC_USER_ID,
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: '',
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create booking';
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/booking/my-bookings')}
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
          }}>Request Resource Booking</h1>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: '500'
          }}>Submit a booking request for a campus facility</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            <FiMapPin style={{ fontSize: '1rem', color: '#3b82f6' }} />
            Facility <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: `2px solid ${errors.resourceId ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '0.75rem',
              fontSize: '1rem',
              background: '#ffffff',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!errors.resourceId) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.resourceId) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <option value="">Select a facility</option>
            {state.facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name} ({facility.type}) - Capacity: {facility.capacity}
              </option>
            ))}
          </select>
          {errors.resourceId && (
            <p style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <FiXCircle style={{ fontSize: '0.75rem' }} />
              {errors.resourceId}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            <FiCalendar style={{ fontSize: '1rem', color: '#3b82f6' }} />
            Date <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={getMinDate()}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: `2px solid ${errors.date ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '0.75rem',
              fontSize: '1rem',
              background: '#ffffff',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!errors.date) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.date) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.date && (
            <p style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <FiXCircle style={{ fontSize: '0.75rem' }} />
              {errors.date}
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              <FiClock style={{ fontSize: '1rem', color: '#3b82f6' }} />
              Start Time <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: `2px solid ${errors.startTime ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '0.75rem',
                fontSize: '1rem',
                background: '#ffffff',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.startTime) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.startTime) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.startTime && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <FiXCircle style={{ fontSize: '0.75rem' }} />
                {errors.startTime}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              <FiClock style={{ fontSize: '1rem', color: '#3b82f6' }} />
              End Time <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: `2px solid ${errors.endTime ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '0.75rem',
                fontSize: '1rem',
                background: '#ffffff',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.endTime) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.endTime) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.endTime && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <FiXCircle style={{ fontSize: '0.75rem' }} />
                {errors.endTime}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            <FiFileText style={{ fontSize: '1rem', color: '#3b82f6' }} />
            Purpose <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the purpose of the booking..."
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: `2px solid ${errors.purpose ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '0.75rem',
              fontSize: '1rem',
              background: '#ffffff',
              transition: 'all 0.2s ease',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              if (!errors.purpose) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.purpose) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.purpose && (
            <p style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <FiXCircle style={{ fontSize: '0.75rem' }} />
              {errors.purpose}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            <FiUsers style={{ fontSize: '1rem', color: '#3b82f6' }} />
            Expected Attendees <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="number"
            name="expectedAttendees"
            value={formData.expectedAttendees}
            onChange={handleChange}
            min="1"
            placeholder="e.g., 25"
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              border: `2px solid ${errors.expectedAttendees ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '0.75rem',
              fontSize: '1rem',
              background: '#ffffff',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!errors.expectedAttendees) {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.expectedAttendees) {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          {errors.expectedAttendees && (
            <p style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <FiXCircle style={{ fontSize: '0.75rem' }} />
              {errors.expectedAttendees}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            background: loading ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #053769 0%, #0f172a 100%)',
            color: '#ffffff',
            fontWeight: '700',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            boxShadow: '0 4px 6px rgba(5, 55, 105, 0.2)',
            opacity: loading ? 0.6 : 1,
            marginTop: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 12px rgba(5, 55, 105, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(5, 55, 105, 0.2)';
            }
          }}
        >
          {loading ? (
            <>
              <FiLoader style={{ fontSize: '1.25rem', animation: 'spin 1s linear infinite' }} />
              Submitting...
            </>
          ) : (
            <>
              <FiSend style={{ fontSize: '1.25rem' }} />
              Submit Booking Request
            </>
          )}
        </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingPage;
