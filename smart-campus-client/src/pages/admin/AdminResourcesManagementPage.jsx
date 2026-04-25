import React, { useState, useEffect } from 'react';
import { facilityApi } from '../../api/facilityApi';
import './AdminResourcesManagementPage.css';

export default function AdminResourcesManagementPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    availabilityWindows: '',
    status: 'available',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilityApi.getAllFacilities();
      setFacilities(response.data);
    } catch (err) {
      setError('Failed to fetch facilities');
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.capacity || !formData.location) {
        setError('Please fill in all required fields');
        console.error('Validation Error - Empty fields:', formData);
        return;
      }

      // Convert capacity to number
      const submittedData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10)
      };

      console.log('========== SUBMITTING FACILITY DATA ==========');
      console.log('Form Data:', submittedData);
      console.log('Name:', submittedData.name, '(Type:', typeof submittedData.name + ')');
      console.log('Type:', submittedData.type, '(Type:', typeof submittedData.type + ')');
      console.log('Capacity:', submittedData.capacity, '(Type:', typeof submittedData.capacity + ')');
      console.log('Location:', submittedData.location, '(Type:', typeof submittedData.location + ')');
      console.log('Status:', submittedData.status, '(Type:', typeof submittedData.status + ')');
      console.log('Description:', submittedData.description, '(Type:', typeof submittedData.description + ')');
      console.log('ImageUrl:', submittedData.imageUrl, '(Type:', typeof submittedData.imageUrl + ')');
      console.log('AvailabilityWindows:', submittedData.availabilityWindows, '(Type:', typeof submittedData.availabilityWindows + ')');
      console.log('========== END DATA ==========');

      if (editingFacility) {
        console.log('Updating facility with ID:', editingFacility.id);
        await facilityApi.updateFacility(editingFacility.id, submittedData);
      } else {
        console.log('Creating new facility');
        await facilityApi.addFacility(submittedData);
      }
      resetForm();
      fetchFacilities();
      setError('');
      console.log('Facility submitted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data || err.message || 'Unknown error';
      const statusCode = err.response?.status || 'Unknown';
      console.error('Error Status:', statusCode);
      console.error('Error Response:', err.response?.data);
      console.error('Full Error:', err);
      setError(`${editingFacility ? 'Failed to update' : 'Failed to add'} facility - ${errorMsg}`);
    }
  };

  const handleEdit = (facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      location: facility.location,
      availabilityWindows: facility.availabilityWindows,
      status: facility.status,
      description: facility.description,
      imageUrl: facility.imageUrl
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await facilityApi.deleteFacility(id);
        fetchFacilities();
      } catch (err) {
        setError('Failed to delete facility');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: '',
      location: '',
      availabilityWindows: '',
      status: 'available',
      description: '',
      imageUrl: ''
    });
    setEditingFacility(null);
    setShowAddForm(false);
    setError('');
  };

  if (loading) {
    return <div className="admin-loading">Loading facilities...</div>;
  }

  return (
    <div className="admin-resources-management">
      <div className="admin-header">
        <h1>Resources Management</h1>
        <p className="admin-subtitle">Manage campus facilities and resources</p>
        <button 
          className="admin-btn admin-btn--primary"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Facility
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showAddForm && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
              <button className="admin-modal-close" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="name">Facility Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="classroom">Classroom</option>
                    <option value="lab">Laboratory</option>
                    <option value="library">Library</option>
                    <option value="sports">Sports Facility</option>
                    <option value="auditorium">Auditorium</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="capacity">Capacity *</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="availabilityWindows">Availability Windows</label>
                  <input
                    type="text"
                    id="availabilityWindows"
                    name="availabilityWindows"
                    value={formData.availabilityWindows}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>

                <div className="admin-form-group admin-form-group--full">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="admin-form-group admin-form-group--full">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  {editingFacility ? 'Update Facility' : 'Add Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-facilities-grid">
        {facilities.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No facilities found</h3>
            <p>Start by adding your first facility to the system.</p>
          </div>
        ) : (
          facilities.map((facility) => (
            <div key={facility.id} className="admin-facility-card">
              <div className="admin-facility-header">
                <h3>{facility.name}</h3>
                <span className={`admin-status admin-status--${facility.status}`}>
                  {facility.status}
                </span>
              </div>
              
              <div className="admin-facility-details">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Type:</span>
                  <span className="admin-detail-value">{facility.type}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Capacity:</span>
                  <span className="admin-detail-value">{facility.capacity} people</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Location:</span>
                  <span className="admin-detail-value">{facility.location}</span>
                </div>
                {facility.availabilityWindows && (
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Availability:</span>
                    <span className="admin-detail-value">{facility.availabilityWindows}</span>
                  </div>
                )}
                {facility.description && (
                  <div className="admin-detail-item admin-detail-item--full">
                    <span className="admin-detail-label">Description:</span>
                    <span className="admin-detail-value">{facility.description}</span>
                  </div>
                )}
              </div>

              {facility.imageUrl && (
                <div className="admin-facility-image">
                  <img src={facility.imageUrl} alt={facility.name} />
                </div>
              )}

              <div className="admin-facility-actions">
                <button 
                  className="admin-btn admin-btn--edit"
                  onClick={() => handleEdit(facility)}
                >
                  Edit
                </button>
                <button 
                  className="admin-btn admin-btn--delete"
                  onClick={() => handleDelete(facility.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
