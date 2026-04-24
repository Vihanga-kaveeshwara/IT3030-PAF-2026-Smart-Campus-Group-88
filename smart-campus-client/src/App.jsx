import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Database eken ena data tika thiyaganna state eka
  const [facilities, setFacilities] = useState([]);

  // Page eka load weddi eka parak data tika backend eken ganna
  useEffect(() => {
    axios.get('http://localhost:8080/api/facilities')
      .then(response => {
        setFacilities(response.data);
      })
      .catch(error => {
        console.error("Backend eken data ganna yaddi error ekak awa:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
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

      {/* Main Content - Module A (Facilities Catalogue) */}
      <main className="container mx-auto mt-8 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Facilities & Assets Catalogue</h2>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow">
              + Add New Resource
            </button>
          </div>

          <div className="mb-6 flex gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              className="border border-gray-300 p-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <select className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>All Types</option>
              <option>Lecture Hall</option>
              <option>Lab</option>
              <option>Meeting Room</option>
              <option>Equipment</option>
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
                
                {/* Backend eken ena data list eka map karanawa */}
                {facilities.length > 0 ? (
                  facilities.map((facility) => (
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
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No facilities found. Database is empty or backend is not connected.
                    </td>
                  </tr>
                )}
                
              </tbody>
            </table>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;