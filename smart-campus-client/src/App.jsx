import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OAuth2CallbackPage from './pages/auth/OAuth2CallbackPage';
import ProfilePage from './pages/auth/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// App pages
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        {/* Authenticated routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedAppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
