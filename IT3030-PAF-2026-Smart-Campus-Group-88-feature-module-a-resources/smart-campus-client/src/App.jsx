import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { TicketProvider } from './features/maintenance/TicketContext';
import { BookingProvider, STATIC_USER_ID } from './features/booking/BookingContext';
import ReportNewIncidentPage from './features/maintenance/ReportNewIncidentPage';
import MyTicketsPage from './features/maintenance/MyTicketsPage';
import TicketDetailPage from './features/maintenance/TicketDetailPage';
import AdminAllTicketsPage from './features/maintenance/AdminAllTicketsPage';
import AdminTicketManagementPage from './features/maintenance/AdminTicketManagementPage';
import TechnicianMyAssignedTicketsPage from './features/maintenance/TechnicianMyAssignedTicketsPage';
import TechnicianTicketDetailPage from './features/maintenance/TechnicianTicketDetailPage';
import CreateBookingPage from './features/booking/CreateBookingPage';
import MyBookingsPage from './features/booking/MyBookingsPage';
import BookingDetailPage from './features/booking/BookingDetailPage';
import AdminBookingsPage from './features/booking/AdminBookingsPage';
import AdminBookingManagementPage from './features/booking/AdminBookingManagementPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const isTechnician = location.pathname.includes('/technician');
  const isBooking = location.pathname.includes('/booking');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Dynamic Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r min-h-screen p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#053769] tracking-wider text-sm">
            {isAdmin ? 'ADMIN PORTAL' : isTechnician ? 'TECHNICIAN PORTAL' : 'USER PORTAL'}
          </h2>
        </div>
        <nav className="flex flex-col gap-2">
          {isAdmin && isBooking ? (
            <Link to="/booking/admin" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname === '/booking/admin' || location.pathname.includes('/booking/admin/manage/') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
               📅 Manage Bookings
            </Link>
          ) : isAdmin ? (
            <Link to="/maintenance/admin" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname === '/maintenance/admin' || location.pathname.includes('/admin/ticket/') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
               🔧 Maintenance
            </Link>
          ) : isTechnician ? (
            <Link to="/maintenance/technician" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname === '/maintenance/technician' || location.pathname.includes('/technician/ticket/') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
               💼 My Assigned Tickets
            </Link>
          ) : (
            <>
              <Link to="/maintenance/report-incident" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname.includes('report-incident') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                 📄 Report Incident
              </Link>
              <Link to="/maintenance/my-tickets" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname.includes('my-tickets') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                 🗂️ My Tickets
              </Link>
              <Link to={`/booking/my-bookings?requesterId=${STATIC_USER_ID}`} className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname.includes('/booking') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                 📅 My Bookings
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
};

function App() {
  return (
    <TicketProvider>
      <BookingProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Navigate to="/maintenance/report-incident" replace />} />
              <Route path="/maintenance/report-incident" element={<ReportNewIncidentPage />} />
              <Route path="/maintenance/my-tickets" element={<MyTicketsPage />} />
              <Route path="/maintenance/ticket/:id" element={<TicketDetailPage />} />
              
              {/* Admin Routes */}
              <Route path="/maintenance/admin" element={<AdminAllTicketsPage />} />
              <Route path="/maintenance/admin/ticket/:id" element={<AdminTicketManagementPage />} />

              {/* Technician Routes */}
              <Route path="/maintenance/technician" element={<TechnicianMyAssignedTicketsPage />} />
              <Route path="/maintenance/technician/ticket/:id" element={<TechnicianTicketDetailPage />} />

              {/* Booking User Routes */}
              <Route path="/booking/create" element={<CreateBookingPage />} />
              <Route path="/booking/my-bookings" element={<MyBookingsPage />} />
              <Route path="/booking/detail/:id" element={<BookingDetailPage />} />

              {/* Booking Admin Routes */}
              <Route path="/booking/admin" element={<AdminBookingsPage />} />
              <Route path="/booking/admin/manage/:id" element={<AdminBookingManagementPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </BookingProvider>
    </TicketProvider>
  );
}

export default App;
