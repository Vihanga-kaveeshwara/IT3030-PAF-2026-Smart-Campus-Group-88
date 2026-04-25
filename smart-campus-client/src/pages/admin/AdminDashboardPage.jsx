import React from 'react';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-welcome">Welcome to the SmartUni Admin Panel</p>
      </div>
      
      <div className="admin-content">
        <div className="admin-card">
          <h2>System Overview</h2>
          <p>Manage and monitor the Smart Campus system from this centralized admin interface.</p>
        </div>
        
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Users</h3>
            <p className="stat-number">--</p>
          </div>
          <div className="stat-card">
            <h3>Bookings</h3>
            <p className="stat-number">--</p>
          </div>
          <div className="stat-card">
            <h3>Facilities</h3>
            <p className="stat-number">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}
