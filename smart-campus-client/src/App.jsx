import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [facilities, setFacilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // ----- Search & Filter states -----
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  // ----------------------------------

  const [formData, setFormData] = useState({
    name: '',
    type: 'Lecture Hall',
    capacity: '',
    location: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = () => {
    axios.get('http://localhost:8080/api/facilities')
      .then(response => {
        setFacilities(response.data);
      })
      .catch(error => console.error("Error fetching data:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', type: 'Lecture Hall', capacity: '', location: '', status: 'ACTIVE' });
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      location: facility.location,
      status: facility.status
    });
    setEditingId(facility.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (editingId) {
      axios.put(`http://localhost:8080/api/facilities/${editingId}`, formData)
        .then(response => {
          setFacilities(facilities.map(fac => fac.id === editingId ? response.data : fac));
          closeModal();
        })
        .catch(error => console.error("Error updating data:", error));
    } else {
      axios.post('http://localhost:8080/api/facilities', formData)
        .then(response => {
          setFacilities([...facilities, response.data]);
          closeModal();
        })
        .catch(error => console.error("Error saving data:", error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      axios.delete(`http://localhost:8080/api/facilities/${id}`)
        .then(() => {
          setFacilities(facilities.filter(facility => facility.id !== id));
        })
        .catch(error => console.error("Error deleting data:", error));
    }
  };

  // ----- Filtered Data Logic -----
  // Table eke pennanne `facilities` nemei, me filter wunu `filteredFacilities` ekai
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All Types' || facility.type === filterType;
    return matchesSearch && matchesType;
  });
  // -------------------------------

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <nav className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Campus Hub</h1>
          <ul className="flex space-x-6">
            <li className="cursor-pointer hover:text-blue-200 border-b-2 border-white pb-1">Catalogue</li>
            <li className="cursor-pointer hover:text-blue-200">Bookings</li>
            <li className="cursor-pointer hover:text-blue-200">Tickets</li>
            <li className="cursor-pointer bg-white text-blue-800 px-3 py-1 rounded font-semibold hover:bg-gray-200 transition">Login</li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Facilities & Assets Catalogue</h2>
            <button 
              onClick={() => { closeModal(); setIsModalOpen(true); }} 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow"
            >
              + Add New Resource
            </button>
          </div>

          <div className="mb-6 flex gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Search Input Eka */}
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            {/* Dropdown Filter Eka */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All Types">All Types</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Lab">Lab</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-left">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-5 text-sm font-bold text-gray-700">Name</th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-700">Type</th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-700">Capacity</th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-700">Location</th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-700">Status</th>
                  <th className="py-3 px-5 text-sm font-bold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Methana `filteredFacilities` walin map karanne */}
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="py-3 px-5 font-medium text-gray-800">{facility.name}</td>
                      <td className="py-3 px-5 text-gray-600">{facility.type}</td>
                      <td className="py-3 px-5 text-gray-600">{facility.capacity}</td>
                      <td className="py-3 px-5 text-gray-600">{facility.location}</td>
                      <td className="py-3 px-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          facility.status === 'ACTIVE' || facility.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {facility.status ? facility.status.toUpperCase() : 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <button 
                          onClick={() => handleEdit(facility)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(facility.id)} 
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No facilities match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Computing Lab 01" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Lab">Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Block C - 3rd Floor" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                  {editingId ? 'Update Resource' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;