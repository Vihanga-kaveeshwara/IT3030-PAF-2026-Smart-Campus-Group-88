import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { TicketProvider } from './features/maintenance/TicketContext';
import ReportNewIncidentPage from './features/maintenance/ReportNewIncidentPage';
import MyTicketsPage from './features/maintenance/MyTicketsPage';
import TicketDetailPage from './features/maintenance/TicketDetailPage';

function App() {
  return (
    <TicketProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-white border-r min-h-screen p-4 flex flex-col">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#053769]">USER PORTAL</h2>
            </div>
            <nav className="flex flex-col gap-2">
              <Link to="/maintenance/report-incident" className="px-4 py-3 bg-[#053769] text-white rounded-xl font-medium flex items-center gap-2">
                 📄 Report Incident
              </Link>
              <Link to="/maintenance/my-tickets" className="px-4 py-3 hover:bg-gray-100 rounded-xl font-medium text-gray-700 flex items-center gap-2 transition">
                 🗂️ My Tickets
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            <Routes>
              {/* Default redirect to report-incident */}
              <Route path="/" element={<Navigate to="/maintenance/report-incident" replace />} />
              <Route path="/maintenance/report-incident" element={<ReportNewIncidentPage />} />
              <Route path="/maintenance/my-tickets" element={<MyTicketsPage />} />
              <Route path="/maintenance/ticket/:id" element={<TicketDetailPage />} />
            </Routes>
          </main>

        </div>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;
