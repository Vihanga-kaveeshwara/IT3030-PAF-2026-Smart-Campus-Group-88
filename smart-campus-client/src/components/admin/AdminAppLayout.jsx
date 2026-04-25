import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import './AdminAppLayout.css';

export default function AdminAppLayout() {
  return (
    <div className="admin-app-shell">
      <AdminSidebar />
      
      <div className="admin-app-shell__content">
        <AdminNavbar />
        <main className="admin-app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
