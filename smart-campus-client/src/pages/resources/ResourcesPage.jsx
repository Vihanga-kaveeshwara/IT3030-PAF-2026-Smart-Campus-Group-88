import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FiMapPin, FiUsers, FiCheckCircle, FiXCircle, FiRefreshCw, FiImage, FiCalendar, FiGrid, FiHome } from 'react-icons/fi';
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
          <FiGrid className="loading-icon" />
          <p>Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-page">
        <div className="error-message">
          <FiXCircle className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchFacilities} className="retry-button">
            <FiRefreshCw className="retry-icon" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      <div className="page-header">
        <div className="header-content">
          <FiHome className="header-icon" />
          <div>
            <h1>Campus Resources</h1>
            <p>Browse available facilities and resources on campus</p>
          </div>
        </div>
      </div>

      {facilities.length === 0 ? (
        <div className="no-facilities">
          <FiGrid className="no-facilities-icon" />
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
                    <FiImage className="placeholder-icon" />
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
                      <FiMapPin className="detail-icon" />
                      <span>{facility.location}</span>
                    </span>
                  )}
                  {facility.capacity && (
                    <span className="detail-item">
                      <FiUsers className="detail-icon" />
                      <span>{facility.capacity} capacity</span>
                    </span>
                  )}
                  {facility.available !== undefined && (
                    <span className={`availability-status ${facility.available ? 'available' : 'unavailable'}`}>
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
