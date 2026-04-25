import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FiArrowLeft, FiGrid, FiXCircle, FiRefreshCw, FiImage, FiMapPin, FiUsers, FiClock, FiPhone, FiTool, FiFileText, FiCheckCircle, FiCalendar, FiMail, FiCheck } from 'react-icons/fi';
import './ResourceDetailPage.css';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacilityDetails();
  }, [id]);

  const fetchFacilityDetails = async () => {
    try {
      setLoading(true);
      // Since the API doesn't have a get by ID endpoint, we'll fetch all and filter
      const response = await api.get('/api/facilities');
      const facilityData = response.data.find(f => f.id === id);
      
      if (facilityData) {
        setFacility(facilityData);
        setError(null);
      } else {
        setError('Facility not found');
      }
    } catch (err) {
      setError('Failed to load facility details. Please try again later.');
      console.error('Error fetching facility details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="resource-detail-page">
        <div className="loading-spinner">
          <FiGrid className="loading-icon" />
          <p>Loading facility details...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="resource-detail-page">
        <div className="error-message">
          <FiXCircle className="error-icon" />
          <p>{error || 'Facility not found'}</p>
          <div className="error-actions">
            <button onClick={fetchFacilityDetails} className="retry-button">
              <FiRefreshCw className="retry-icon" />
              Retry
            </button>
            <Link to="/resources" className="back-button">
              <FiArrowLeft className="back-icon" />
              Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-detail-page">
      <div className="detail-header">
        <Link to="/resources" className="back-link">
          <FiArrowLeft className="back-link-icon" />
          Back to Resources
        </Link>
        <h1>{facility.name}</h1>
      </div>

      <div className="detail-content">
        <div className="facility-image-section">
          {facility.imageUrl ? (
            <img src={facility.imageUrl} alt={facility.name} className="facility-main-image" />
          ) : (
            <div className="placeholder-main-image">
              <FiImage className="placeholder-icon" />
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="facility-info-section">
          <div className="facility-header-info">
            <span className="facility-type">{facility.type || 'Facility'}</span>
            {facility.available !== undefined && (
              <span className={`availability-badge ${facility.available ? 'available' : 'unavailable'}`}>
                {facility.available ? (
                  <>
                    <FiCheckCircle className="status-icon" />
                    Available
                  </>
                ) : (
                  <>
                    <FiXCircle className="status-icon" />
                    Unavailable
                  </>
                )}
              </span>
            )}
          </div>

          <div className="facility-description">
            <h2>Description</h2>
            <p>
              {facility.description || 'No description available for this facility.'}
            </p>
          </div>

          <div className="facility-details-grid">
            <h2>Facility Details</h2>
            <div className="details-grid">
              {facility.location && (
                <div className="detail-item">
                  <FiMapPin className="detail-icon" />
                  <div>
                    <strong>Location</strong>
                    <span>{facility.location}</span>
                  </div>
                </div>
              )}
              {facility.capacity && (
                <div className="detail-item">
                  <FiUsers className="detail-icon" />
                  <div>
                    <strong>Capacity</strong>
                    <span>{facility.capacity} people</span>
                  </div>
                </div>
              )}
              {facility.operatingHours && (
                <div className="detail-item">
                  <FiClock className="detail-icon" />
                  <div>
                    <strong>Operating Hours</strong>
                    <span>{facility.operatingHours}</span>
                  </div>
                </div>
              )}
              {facility.contactInfo && (
                <div className="detail-item">
                  <FiPhone className="detail-icon" />
                  <div>
                    <strong>Contact Information</strong>
                    <span>{facility.contactInfo}</span>
                  </div>
                </div>
              )}
              {facility.equipment && (
                <div className="detail-item">
                  <FiTool className="detail-icon" />
                  <div>
                    <strong>Equipment</strong>
                    <span>{facility.equipment}</span>
                  </div>
                </div>
              )}
              {facility.rules && (
                <div className="detail-item">
                  <FiFileText className="detail-icon" />
                  <div>
                    <strong>Rules & Regulations</strong>
                    <span>{facility.rules}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {facility.amenities && facility.amenities.length > 0 && (
            <div className="amenities-section">
              <h2>Amenities</h2>
              <div className="amenities-list">
                {Array.isArray(facility.amenities) 
                  ? facility.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        <FiCheck className="amenity-icon" />
                        {amenity}
                      </span>
                    ))
                  : facility.amenities.split(',').map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        <FiCheck className="amenity-icon" />
                        {amenity.trim()}
                      </span>
                    ))
                }
              </div>
            </div>
          )}

          <div className="action-buttons">
            {facility.available && (
              <button className="book-button" onClick={() => navigate('/booking/create')}>
                <FiCalendar className="button-icon" />
                Book This Facility
              </button>
            )}
            <button className="inquire-button" onClick={() => navigate('/contact')}>
              <FiMail className="button-icon" />
              Make Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
