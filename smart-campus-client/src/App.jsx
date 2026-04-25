<<<<<<< HEAD
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

// Auth pages
import LoginPage          from './pages/auth/LoginPage';
import SignupPage         from './pages/auth/SignupPage';
import OAuth2CallbackPage from './pages/auth/OAuth2CallbackPage';
import ProfilePage        from './pages/auth/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';

// App pages
import DashboardPage      from './pages/DashboardPage';
import NotificationsPage  from './pages/notifications/NotificationsPage';

// Resource pages
function PlaceholderPage({ name }) {
  return (
    <div className="page-container">
      <h1 className="page-title">{name}</h1>
      <p style={{ color: '#6b7280' }}>This section is implemented by another team member.</p>
    </div>
  );
}

function ProtectedAppLayout() {
  return (
    <NotificationProvider>
      <AppLayout />
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/signup"          element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        {/* Authenticated routes – wrapped in layout with Navbar */}
        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedAppLayout />}>
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile"       element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/"   element={<Navigate to="/dashboard" replace />} />
        <Route path="*"   element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
=======
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { TicketProvider } from './features/maintenance/TicketContext';
import ReportNewIncidentPage from './features/maintenance/ReportNewIncidentPage';
import MyTicketsPage from './features/maintenance/MyTicketsPage';
import TicketDetailPage from './features/maintenance/TicketDetailPage';
import AdminAllTicketsPage from './features/maintenance/AdminAllTicketsPage';
import AdminTicketManagementPage from './features/maintenance/AdminTicketManagementPage';
import TechnicianMyAssignedTicketsPage from './features/maintenance/TechnicianMyAssignedTicketsPage';
import TechnicianTicketDetailPage from './features/maintenance/TechnicianTicketDetailPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const isTechnician = location.pathname.includes('/technician');

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
          {isAdmin ? (
            <Link to="/maintenance/admin" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname === '/maintenance/admin' || location.pathname.includes('/admin/ticket/') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                Maintenance
            </Link>
          ) : isTechnician ? (
            <Link to="/maintenance/technician" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname === '/maintenance/technician' || location.pathname.includes('/technician/ticket/') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                My Assigned Tickets
            </Link>
          ) : (
            <>
              <Link to="/maintenance/report-incident" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname.includes('report-incident') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                 📄 Report Incident
              </Link>
              <Link to="/maintenance/my-tickets" className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 ${location.pathname.includes('my-tickets') ? 'bg-[#053769] text-white' : 'hover:bg-gray-100 text-gray-700 transition'}`}>
                 🗂️ My Tickets
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;
>>>>>>> 5131f4fa443806cea22cfc37774d85081fd5eef0
