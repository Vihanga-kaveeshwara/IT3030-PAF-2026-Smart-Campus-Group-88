import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute, AdminRoute, TechnicianRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout'
import { NotificationProvider } from './context/NotificationContext';
import { BookingProvider } from './pages/booking/BookingContext';
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
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAppLayout from './components/admin/AdminAppLayout';
import AdminResourcesManagementPage from './pages/admin/AdminResourcesManagementPage';

//Resource pages
import ResourcesPage from './pages/resources/ResourcesPage'
import ResourceDetailPage from './pages/resources/ResourceDetailPage';

//Booking pages
import BookingDetailPage from './pages/booking/BookingDetailPage';
import CreateBookingPage from './pages/booking/CreateBookingPage';
import MyBookingsPage from './pages/booking/MyBookingsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminBookingManagementPage from './pages/admin/AdminBookingManagementPage';

// Maintenance context
import { TicketProvider } from './features/maintenance/TicketContext';

// Maintenance feature pages
import AllTicketsPage from './pages/admin/AllTicketsPage';
import AdminTicketManagementPage from './pages/admin/AdminTicketManagementPage';
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

function TicketsPage() {
  const { isAdmin, isTechnician } = useAuth();
  
  if (isAdmin) {
    return <Navigate to="/maintenance/admin" replace />;
  } else if (isTechnician) {
    return <Navigate to="/maintenance/technician/tickets" replace />;
  } else {
    return (
      <TicketProvider>
        <MyTicketsPage />
      </TicketProvider>
    );
  }
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

        {/* Admin dashboard and routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminAppLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/booking/*" element={
              <BookingProvider>
                <Routes>
                  <Route path="all" element={<AdminBookingsPage />} />
                  <Route path="manage/:id" element={<AdminBookingManagementPage />} />
                </Routes>
              </BookingProvider>
            } />
            <Route path="/admin/maintenance" element={
              <TicketProvider>
                <AllTicketsPage />
              </TicketProvider>
            } />
            <Route path="/admin/maintenance/ticket/:id" element={
              <TicketProvider>
                <AdminTicketManagementPage />
              </TicketProvider>
            } />
            <Route path="/admin/resources" element={<AdminResourcesManagementPage />} />
          </Route>
        </Route>

        {/* Authenticated routes – wrapped in layout with Navbar */}
        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedAppLayout />}>
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile"       element={<ProfilePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />

            
            {/* Other modules (replace placeholders with real pages) */}
            <Route path="/booking/*" element={
              <BookingProvider>
                <Routes>
                  <Route path="detail/:id" element={<BookingDetailPage />} />
                  <Route path="create" element={<CreateBookingPage />} />
                  <Route path="my-bookings" element={<MyBookingsPage />} />
                </Routes>
              </BookingProvider>
            } />

            {/* Maintenance module routes */}
            <Route path="/maintenance/my-tickets" element={
              <TicketProvider>
                <MyTicketsPage />
              </TicketProvider>
            } />
            <Route path="/maintenance/report" element={
              <TicketProvider>
                <ReportNewIncidentPage />
              </TicketProvider>
            } />
            <Route path="/maintenance/ticket/:id" element={
              <TicketProvider>
                <TicketDetailPage />
              </TicketProvider>
            } />
            
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
