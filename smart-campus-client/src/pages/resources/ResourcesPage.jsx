import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import './ResourcesPage.css';

const ResourcesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/facilities');
      setFacilities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load facilities. Please try again later.');
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="resources-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchFacilities} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      <div className="page-header">
        <h1>Campus Resources</h1>
        <p>Browse available facilities and resources on campus</p>
      </div>

      {facilities.length === 0 ? (
        <div className="no-facilities">
          <p>No facilities available at the moment.</p>
        </div>
      ) : (
        <div className="facilities-grid">
          {facilities.map((facility) => (
            <div key={facility.id} className="facility-card">
              <div className="facility-image">
                {facility.imageUrl ? (
                  <img src={facility.imageUrl} alt={facility.name} />
                ) : (
                  <div className="placeholder-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="facility-content">
                <h3>{facility.name}</h3>
                <p className="facility-type">{facility.type || 'Facility'}</p>
                <p className="facility-description">
                  {facility.description || 'No description available.'}
                </p>
                <div className="facility-details">
                  {facility.location && (
                    <span className="detail-item">
                      <strong>Location:</strong> {facility.location}
                    </span>
                  )}
                  {facility.capacity && (
                    <span className="detail-item">
                      <strong>Capacity:</strong> {facility.capacity}
                    </span>
                  )}
                  {facility.available !== undefined && (
                    <span className={`availability-status ${facility.available ? 'available' : 'unavailable'}`}>
                      {facility.available ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </div>
                <Link 
                  to={`/resources/${facility.id}`} 
                  className="view-details-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
