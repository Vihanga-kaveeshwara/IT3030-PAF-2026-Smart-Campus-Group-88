import React, { useState, useContext, useEffect } from 'react';
import { BookingContext, STATIC_USER_ID } from './BookingContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Request Resource Booking</h1>
      <p className="text-gray-600 mb-8">Submit a booking request for a campus facility</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facility <span className="text-red-500">*</span>
          </label>
          <select
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.resourceId ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
          >
            <option value="">Select a facility</option>
            {state.facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name} ({facility.type}) - Capacity: {facility.capacity}
              </option>
            ))}
          </select>
          {errors.resourceId && <p className="text-red-500 text-xs mt-1">{errors.resourceId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={getMinDate()}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.date ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.startTime ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.endTime ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the purpose of the booking..."
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.purpose ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
          />
          {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Attendees <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="expectedAttendees"
            value={formData.expectedAttendees}
            onChange={handleChange}
            min="1"
            placeholder="e.g., 25"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.expectedAttendees ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
          />
          {errors.expectedAttendees && <p className="text-red-500 text-xs mt-1">{errors.expectedAttendees}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#053769] text-white py-4 rounded-xl font-semibold hover:bg-[#042d55] transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default CreateBookingPage;
