import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute, TechnicianRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout'
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


// Maintenance feature pages
import AdminAllTicketsPage from './features/maintenance/AdminAllTicketsPage';
import AdminTicketManagementPage from './features/maintenance/AdminTicketManagementPage';
import MyTicketsPage from './features/maintenance/MyTicketsPage';
import ReportNewIncidentPage from './features/maintenance/ReportNewIncidentPage';
import TechnicianMyAssignedTicketsPage from './features/maintenance/TechnicianMyAssignedTicketsPage';
import TechnicianTicketDetailPage from './features/maintenance/TechnicianTicketDetailPage';
import TicketDetailPage from './features/maintenance/TicketDetailPage';

function ProtectedAppLayout() {
  return (
    <NotificationProvider>
      <AppLayout />
    </NotificationProvider>
  );
}

function PlaceholderPage({ name }) {
  return (
    <div className="page-container">
      <h1 className="page-title">{name}</h1>
      <p style={{ color: '#6b7280' }}>This section is implemented by another team member.</p>
    </div>
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

            
            {/* Other modules (replace placeholders with real pages) */}
            <Route path="/bookings"   element={<PlaceholderPage name="Bookings" />} />

            {/* Maintenance module routes */}
            <Route path="/maintenance/my-tickets" element={<MyTicketsPage />} />
            <Route path="/maintenance/report" element={<ReportNewIncidentPage />} />
            <Route path="/maintenance/ticket/:id" element={<TicketDetailPage />} />
            
            {/* Admin maintenance routes */}
            <Route element={<AdminRoute />}>
              <Route path="/maintenance/admin" element={<AdminAllTicketsPage />} />
              <Route path="/maintenance/admin/ticket/:id" element={<AdminTicketManagementPage />} />
            </Route>
            
            {/* Technician maintenance routes */}
            <Route element={<TechnicianRoute />}>
              <Route path="/maintenance/technician/tickets" element={<TechnicianMyAssignedTicketsPage />} />
              <Route path="/maintenance/technician/ticket/:id" element={<TechnicianTicketDetailPage />} />
            </Route>

                      </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/"   element={<Navigate to="/dashboard" replace />} />
        <Route path="*"   element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
