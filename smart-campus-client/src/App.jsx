import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [facilities, setFacilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');

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

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All Types' || facility.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative font-sans">
      <nav className="bg-linear-to-r from-blue-900 to-blue-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Smart Campus Hub</h1>
          <ul className="flex space-x-6 items-center">
            <li className="cursor-pointer text-blue-200 hover:text-white border-b-2 border-white pb-1 transition-all duration-300">Catalogue</li>
            <li className="cursor-pointer text-blue-200 hover:text-white transition-all duration-300">Bookings</li>
            <li className="cursor-pointer text-blue-200 hover:text-white transition-all duration-300">Tickets</li>
            <li className="cursor-pointer bg-white text-blue-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 hover:shadow-md active:scale-95 transition-all duration-200">Login</li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Facilities & Assets</h2>
            <button 
              onClick={() => { closeModal(); setIsModalOpen(true); }} 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Add New Resource
            </button>
          </div>

          <div className="mb-8 flex gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
            <input 
              type="text" 
              placeholder="🔍 Search by name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none" 
            />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-64 p-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Lab">Lab</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Capacity</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-blue-50/50 hover:shadow-sm transform hover:-translate-y-0.5 transition-all duration-200 group">
                      <td className="py-4 px-6 font-semibold text-gray-800">{facility.name}</td>
                      <td className="py-4 px-6 text-gray-600">{facility.type}</td>
                      <td className="py-4 px-6 text-gray-600 font-medium">{facility.capacity}</td>
                      <td className="py-4 px-6 text-gray-600">{facility.location}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide ${
                          facility.status === 'ACTIVE' || facility.status === 'Available' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {facility.status ? facility.status.toUpperCase() : 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleEdit(facility)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium text-sm mr-2 active:scale-95 transition-all duration-200 opacity-80 group-hover:opacity-100"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(facility.id)} 
                          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium text-sm active:scale-95 transition-all duration-200 opacity-80 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500 font-medium">
                      No facilities match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </main>

      {/* Modal with simple fade-in effect via Tailwind */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform scale-100 transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold text-gray-800">
                {editingId ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Resource Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Computing Lab 01" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all cursor-pointer">
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Lab">Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. 50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Block C - 3rd Floor" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all cursor-pointer">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:scale-95 transition-all">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all">
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