import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions using ref
      if (hasProcessed.current) {
        console.log('OAuth callback - already processed, skipping...');
        return;
      }
      hasProcessed.current = true;
      console.log('=== OAuth Callback Processing ===');
      
      const token = searchParams.get('token');
      const err   = searchParams.get('error');
      
      console.log('Token in URL:', !!token);
      console.log('Error in URL:', err || 'none');

      if (err || !token) {
        setError(err ? 'Google login failed. Please try again.' : 'No token received.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Set token in localStorage FIRST
      localStorage.setItem('token', token);

      try {
        console.log('Calling getMe API with token...');
        // Call getMe directly - axios interceptor will pick up token from localStorage
        const res = await authApi.getMe();
        console.log('getMe success, user data:', res.data);
        // Set user in context
        setUser(res.data);
        console.log('User set in context, navigating to dashboard...');
        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } catch (e) {
        console.error('getMe failed:', e.response?.status, e.response?.data);
        localStorage.removeItem('token');
        setError('Failed to load your profile. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, []); // Empty dependency array - run only once

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="alert alert-error">{error}</div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
            Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Completing sign-in…</p>
      </div>
    </div>
  );
}