import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ProfileSidebar.css';

function ProfileSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/profile' || path === '/profile/dashboard') {
      return location.pathname === '/profile' || location.pathname === '/profile/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="profile-sidebar">
      <Link to="/" className="sidebar-logo">
        <i className="fas fa-recycle"></i>
        <span>SwapIt</span>
      </Link>
      
      <nav className="sidebar-nav">
        <Link to="/profile/dashboard" className={`sidebar-nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <i className="fas fa-th-large"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/profile/swaps" className={`sidebar-nav-item ${isActive('/profile/swaps') ? 'active' : ''}`}>
          <i className="fas fa-exchange-alt"></i>
          <span>Swaps</span>
        </Link>
        <Link to="/profile/items" className={`sidebar-nav-item ${isActive('/profile/items') ? 'active' : ''}`}>
          <i className="fas fa-box"></i>
          <span>Items</span>
        </Link>
        <Link to="/notifications" className={`sidebar-nav-item ${isActive('/notifications') ? 'active' : ''}`}>
          <i className="fas fa-bell"></i>
          <span>Notifications</span>
        </Link>
        <Link to="/chat" className={`sidebar-nav-item ${isActive('/chat') ? 'active' : ''}`}>
          <i className="fas fa-comments"></i>
          <span>Chats</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/profile/help" className="sidebar-nav-item">
          <i className="fas fa-question-circle"></i>
          <span>Help</span>
        </Link>
        <Link to="/profile/feedback" className="sidebar-nav-item">
          <i className="fas fa-comment-dots"></i>
          <span>Feedback</span>
        </Link>
        <Link to="/profile/settings" className="sidebar-nav-item">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </Link>
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileSidebar;
