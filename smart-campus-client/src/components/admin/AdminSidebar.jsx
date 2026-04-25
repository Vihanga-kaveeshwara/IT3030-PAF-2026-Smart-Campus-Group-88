import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/booking/all', label: 'Bookings', icon: '📅' },
    { path: '/admin/maintenance', label: 'Maintenance', icon: '🔧' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/resources', label: 'Resources', icon: '🏢' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span className="admin-logo-icon">🎓</span>
          <span className="admin-logo-text">SmartUni Admin</span>
        </div>
      </div>
      
      <nav className="admin-nav">
        <ul className="admin-nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="admin-nav-item">
              <Link
                to={item.path}
                className={`admin-nav-link ${
                  location.pathname.includes(item.path) ? 'active' : ''
                }`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span className="admin-nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">👤</div>
          <div className="admin-user-details">
            <div className="admin-user-name">Administrator</div>
            <div className="admin-user-role">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
