import api from './axiosInstance';

export const facilityApi = {
  // Get all facilities
  getAllFacilities: () => api.get('/api/facilities'),
  
  // Add new facility
  addFacility: (facilityData) => api.post('/api/facilities', facilityData),
  
  // Update facility
  updateFacility: (id, facilityData) => api.put(`/api/facilities/${id}`, facilityData),
  
  // Delete facility
  deleteFacility: (id) => api.delete(`/api/facilities/${id}`)
};
