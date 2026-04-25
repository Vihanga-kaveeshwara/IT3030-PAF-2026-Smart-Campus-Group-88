import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [currentView, setCurrentView] = useState('admin');
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
    status: 'ACTIVE',
    imageUrl: '',
    description: ''
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

  // --- File Upload Handler Eka (Auto Compress karanawa) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Photo eke width eka 600px walata adu karanawa
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Quality eka 0.7 (70%) karala Base64 gannawa
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData({ ...formData, imageUrl: compressedBase64 });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', type: 'Lecture Hall', capacity: '', location: '', status: 'ACTIVE', imageUrl: '', description: '' });
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      type: facility.type,
      capacity: facility.capacity,
      location: facility.location,
      status: facility.status,
      imageUrl: facility.imageUrl || '',
      description: facility.description || ''
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

  // ==========================================
  // USER VIEW EKA
  // ==========================================
  if (currentView === 'user') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800 relative">
        <button 
          onClick={() => setCurrentView('admin')} 
          className="fixed bottom-6 right-6 z-[9999] bg-purple-600 text-white font-bold px-4 py-2 rounded-lg shadow-2xl hover:bg-purple-700 transition-all border-2 border-white"
        >
          ⚙️ Dev: Back to Admin
        </button>

        <header className="bg-blue-950 text-white shadow-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-blue-950 flex items-center justify-center rounded-full font-extrabold text-xl shadow-lg">SC</div>
              <h1 className="text-2xl font-extrabold tracking-wide uppercase">Smart Campus</h1>
            </div>
            <ul className="flex space-x-8 items-center font-medium">
              <li className="cursor-pointer hover:text-blue-300 transition-colors duration-300 border-b-2 border-white pb-1">Catalogue</li>
              <li className="cursor-pointer hover:text-blue-300 transition-colors duration-300">My Bookings</li>
              <li className="cursor-pointer hover:text-blue-300 transition-colors duration-300">Support Tickets</li>
              <li className="cursor-pointer bg-white text-blue-950 px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-all duration-200">Profile</li>
            </ul>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-6 py-10">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold text-blue-950 mb-4 tracking-tight">Explore Campus Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">Browse and request bookings for lecture halls, laboratories, meeting rooms, and specialized equipment.</p>
            
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
              <input 
                type="text" 
                placeholder="🔍 Search by name or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-950 focus:ring-2 focus:ring-blue-200 outline-none font-medium" 
              />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-64 p-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-950 focus:ring-2 focus:ring-blue-200 outline-none font-medium cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Lecture Hall">Lecture Hall</option>
                <option value="Lab">Lab</option>
                <option value="Meeting Room">Meeting Room</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
          </div>

          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFacilities.map((facility) => (
                <div key={facility.id} className="bg-gray-100 rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {facility.imageUrl ? (
                      <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <span className="text-5xl">📷</span>
                      </div>
                    )}
                    <div className={`absolute top-0 w-full h-1.5 ${facility.status === 'ACTIVE' || facility.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{facility.type}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${facility.status === 'ACTIVE' || facility.status === 'Available' ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'}`}>
                        {facility.status ? facility.status.toUpperCase() : 'UNKNOWN'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{facility.name}</h3>
                    
                    {facility.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                          {facility.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-2 text-sm">
                      <p className="text-gray-600 flex items-center gap-2"><span className="text-lg">📍</span> <span className="font-medium">{facility.location}</span></p>
                      <p className="text-gray-600 flex items-center gap-2"><span className="text-lg">👥</span> <span className="font-medium">Capacity: {facility.capacity}</span></p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-200 border-t border-gray-300 mt-auto">
                    <button 
                      disabled={facility.status !== 'ACTIVE' && facility.status !== 'Available'}
                      className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 active:scale-95 ${facility.status === 'ACTIVE' || facility.status === 'Available' ? 'bg-blue-950 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                      {facility.status === 'ACTIVE' || facility.status === 'Available' ? 'Request Booking' : 'Currently Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No facilities found</h3>
            </div>
          )}
        </main>

        {/* ================= MISSING FOOTER EKA METHANATA DAMMA ================= */}
        <footer className="bg-black text-white pt-12 pb-6 mt-12 border-t-4 border-blue-900">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-xl font-extrabold mb-4 text-blue-400 tracking-wide uppercase">Smart Campus Hub</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Streamlining university operations with modern, efficient, and user-friendly facility and asset management solutions.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Campus Map</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">Booking Guidelines</li>
                  <li className="hover:text-blue-400 cursor-pointer transition-colors">IT Support & Tickets</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>📧 support@smartcampus.edu</li>
                  <li>📞 +94 11 234 5678</li>
                  <li>🏢 Administration Block, Main Campus</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
              <p>&copy; {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.</p>
              <div className="mt-4 md:mt-0 space-x-4">
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
        {/* =================================================================== */}
      </div>
    );
  }

  // ==========================================
  // ADMIN VIEW EKA
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 relative font-sans">
      <nav className="bg-linear-to-r from-blue-900 to-blue-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Smart Campus Hub (Admin)</h1>
          <ul className="flex space-x-6 items-center">
            <li className="cursor-pointer text-blue-200 hover:text-white border-b-2 border-white pb-1">Catalogue</li>
            <li className="cursor-pointer text-blue-200 hover:text-white">Bookings</li>
            <li className="ml-4">
              <button onClick={() => setCurrentView('user')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-md active:scale-95">Go to User View →</button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">Facilities & Assets Management</h2>
            <button onClick={() => { closeModal(); setIsModalOpen(true); }} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 flex items-center gap-2">
              <span className="text-xl leading-none">+</span> Add New Resource
            </button>
          </div>

          <div className="mb-8 flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input type="text" placeholder="Search by name or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg outline-none" />
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase">Name</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase">Type</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase">Capacity</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase">Location</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase">Status</th>
                  <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFacilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-blue-50/50 transition-all duration-200">
                    <td className="py-4 px-6 font-semibold text-gray-800 flex items-center gap-3">
                      {facility.imageUrl ? (
                        <img src={facility.imageUrl} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">📷</div>
                      )}
                      {facility.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{facility.type}</td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{facility.capacity}</td>
                    <td className="py-4 px-6 text-gray-600">{facility.location}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold ${facility.status === 'ACTIVE' || facility.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {facility.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => handleEdit(facility)} className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg font-medium text-sm mr-2">Edit</button>
                      <button onClick={() => handleDelete(facility.id)} className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADMIN MODAL EKA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold text-gray-800">{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Resource Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 p-2.5 rounded-lg outline-none" placeholder="e.g. Computing Lab 01" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 p-2.5 rounded-lg outline-none cursor-pointer">
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Lab">Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required className="w-full border border-gray-300 p-2.5 rounded-lg outline-none" placeholder="e.g. 50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full border border-gray-300 p-2.5 rounded-lg outline-none" placeholder="e.g. Block C - 3rd Floor" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Upload Photo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full border border-gray-300 p-2 rounded-lg outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img src={formData.imageUrl} alt="Preview" className="h-24 w-full object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Facilities / Description (Optional)</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows="3" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg outline-none resize-none" 
                  placeholder="e.g. Soundproof, A/C, 2 Projectors, Smart Board..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 p-2.5 rounded-lg outline-none cursor-pointer">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
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