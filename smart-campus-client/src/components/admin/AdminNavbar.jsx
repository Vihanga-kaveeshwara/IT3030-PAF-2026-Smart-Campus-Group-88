import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminNavbar.css';

export default function AdminNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <div className="admin-breadcrumb">
          <span className="admin-breadcrumb-item">Admin Panel</span>
        </div>
      </div>

      <div className="admin-navbar-center">
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="Search admin functions..."
            className="admin-search-input"
          />
          <button className="admin-search-btn">🔍</button>
        </div>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-notifications">
          <button className="admin-notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
        </div>

        <div className="admin-user-menu">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name || 'Admin User'}</span>
            <span className="admin-user-email">{user?.email || 'admin@smartuni.edu'}</span>
          </div>
          <div className="admin-user-actions">
            <Link to="/profile" className="admin-profile-btn">
              <span>👤</span>
            </Link>
            <button onClick={logout} className="admin-logout-btn">
              <span>🚪</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
