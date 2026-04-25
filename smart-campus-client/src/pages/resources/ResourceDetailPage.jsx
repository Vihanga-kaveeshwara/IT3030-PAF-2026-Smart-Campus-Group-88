import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
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
          <div className="spinner"></div>
          <p>Loading facility details...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="resource-detail-page">
        <div className="error-message">
          <p>{error || 'Facility not found'}</p>
          <div className="error-actions">
            <button onClick={fetchFacilityDetails} className="retry-button">
              Retry
            </button>
            <Link to="/resources" className="back-button">
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
          ← Back to Resources
        </Link>
        <h1>{facility.name}</h1>
      </div>

      <div className="detail-content">
        <div className="facility-image-section">
          {facility.imageUrl ? (
            <img src={facility.imageUrl} alt={facility.name} className="facility-main-image" />
          ) : (
            <div className="placeholder-main-image">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="facility-info-section">
          <div className="facility-header-info">
            <span className="facility-type">{facility.type || 'Facility'}</span>
            {facility.available !== undefined && (
              <span className={`availability-badge ${facility.available ? 'available' : 'unavailable'}`}>
                {facility.available ? 'Available' : 'Unavailable'}
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
                  <strong>Location:</strong>
                  <span>{facility.location}</span>
                </div>
              )}
              {facility.capacity && (
                <div className="detail-item">
                  <strong>Capacity:</strong>
                  <span>{facility.capacity} people</span>
                </div>
              )}
              {facility.operatingHours && (
                <div className="detail-item">
                  <strong>Operating Hours:</strong>
                  <span>{facility.operatingHours}</span>
                </div>
              )}
              {facility.contactInfo && (
                <div className="detail-item">
                  <strong>Contact Information:</strong>
                  <span>{facility.contactInfo}</span>
                </div>
              )}
              {facility.equipment && (
                <div className="detail-item">
                  <strong>Equipment:</strong>
                  <span>{facility.equipment}</span>
                </div>
              )}
              {facility.rules && (
                <div className="detail-item">
                  <strong>Rules & Regulations:</strong>
                  <span>{facility.rules}</span>
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
                        {amenity}
                      </span>
                    ))
                  : facility.amenities.split(',').map((amenity, index) => (
                      <span key={index} className="amenity-tag">
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
                Book This Facility
              </button>
            )}
            <button className="inquire-button" onClick={() => navigate('/contact')}>
              Make Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
