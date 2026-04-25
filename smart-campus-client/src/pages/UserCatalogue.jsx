import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserCatalogue() {
  const [facilities, setFacilities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  useEffect(() => {
    // Database eken data genna gannawa (Read only)
    axios.get('http://localhost:8080/api/facilities')
      .then(response => setFacilities(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Search saha Filter logic eka
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All Types' || facility.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleBookingClick = (facilityName) => {
    alert(`Module B: Directing to booking form for ${facilityName}...`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      
      {/* ================= HEADER SECTION ================= */}
      <header className="bg-blue-950 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-blue-950 flex items-center justify-center rounded-full font-extrabold text-xl shadow-lg">
              SC
            </div>
            <h1 className="text-2xl font-extrabold tracking-wide uppercase">Smart Campus</h1>
          </div>
          <nav>
            <ul className="flex space-x-8 items-center font-medium">
              <li className="cursor-pointer hover:text-blue-300 transition-colors duration-300 relative group">
                Catalogue
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 transform scale-x-100 transition-transform duration-300"></span>
              </li>
              <li className="cursor-pointer hover:text-blue-300 transition-colors duration-300 relative group">
                My Bookings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="cursor-pointer hover:text-blue-300 transition-colors duration-300 relative group">
                Support Tickets
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
              </li>
              <li className="ml-4">
                <button className="bg-white text-blue-950 px-6 py-2 rounded-full font-bold hover:bg-gray-200 hover:shadow-lg active:scale-95 transition-all duration-200">
                  Profile
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <main className="flex-grow container mx-auto px-6 py-10">
        
        {/* Page Title & Search Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-blue-950 mb-4 tracking-tight">Explore Campus Facilities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">Browse and request bookings for lecture halls, laboratories, meeting rooms, and specialized equipment across the campus.</p>
          
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex-grow relative">
              <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-950 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none font-medium" 
              />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-64 p-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-950 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none font-medium cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Lab">Lab</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
        </div>

        {/* Facilities Grid (Cards) */}
        {filteredFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility) => (
              <div 
                key={facility.id} 
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col"
              >
                {/* Card Top Color Bar based on Status */}
                <div className={`h-2 w-full ${facility.status === 'ACTIVE' || facility.status === 'Available' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {facility.type}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      facility.status === 'ACTIVE' || facility.status === 'Available' ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'
                    }`}>
                      {facility.status ? facility.status : 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-950 transition-colors duration-300">
                    {facility.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600 flex items-center gap-2">
                      <span className="text-xl">📍</span> <span className="font-medium">{facility.location}</span>
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <span className="text-xl">👥</span> <span className="font-medium">Capacity: {facility.capacity}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer with Action Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={() => handleBookingClick(facility.name)}
                    disabled={facility.status !== 'ACTIVE' && facility.status !== 'Available'}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all duration-300 active:scale-95 ${
                      facility.status === 'ACTIVE' || facility.status === 'Available' 
                      ? 'bg-blue-950 hover:bg-blue-800 hover:shadow-lg' 
                      : 'bg-gray-400 cursor-not-allowed opacity-70'
                    }`}
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
            <p className="text-gray-500">We couldn't find any resources matching your search criteria.</p>
          </div>
        )}

      </main>

      {/* ================= FOOTER SECTION ================= */}
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

    </div>
  );
}

export default UserCatalogue;