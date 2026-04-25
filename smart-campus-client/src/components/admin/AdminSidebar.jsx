import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiCalendar, FiTool, FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import './AdminSidebar.css';

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/admin/booking/all', label: 'Bookings', icon: FiCalendar },
    { path: '/admin/maintenance', label: 'Maintenance', icon: FiTool },
    { path: '/admin/resources', label: 'Resources', icon: FiHome },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <FiHome className="admin-logo-icon" />
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
                <item.icon className="admin-nav-icon" />
                <span className="admin-nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <FiUser className="admin-user-avatar" />
          <div className="admin-user-details">
            <div className="admin-user-name">Administrator</div>
            <div className="admin-user-role">Admin</div>
          </div>
        </div>
        <button className="admin-logout-btn">
          <FiLogOut className="admin-logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
