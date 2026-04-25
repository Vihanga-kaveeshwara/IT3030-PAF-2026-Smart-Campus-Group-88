import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiGrid, FiCalendar, FiTool, FiBell, FiUser, FiSettings, FiShield } from 'react-icons/fi';

export default function Sidebar() {
  const { isAdmin, isTechnician } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/resources', label: 'Resources', icon: <FiGrid /> },
    { to: '/booking/my-bookings', label: 'Bookings', icon: <FiCalendar /> },
    { to: '/tickets', label: isTechnician && !isAdmin ? 'My Tickets' : 'Tickets', icon: <FiTool /> },
    { to: '/notifications', label: 'Notifications', icon: <FiBell /> },
    { to: '/profile', label: 'Profile', icon: <FiUser /> },
    { to: '/settings', label: 'Settings', icon: <FiSettings /> },
  ];

  if (isAdmin) {
    links.splice(4, 0, { to: '/admin', label: 'Admin Panel', icon: <FiShield /> });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">SmartUni</div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}