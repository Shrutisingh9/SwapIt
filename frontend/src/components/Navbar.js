import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const CATEGORIES = [
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Furniture', value: 'Furniture' },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Books', value: 'Books' },
  { label: 'Other', value: 'Other' }
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(urlParams.get('q') || '');
  const [locationFilter, setLocationFilter] = useState('India');
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearchQuery(p.get('q') || '');
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      const current = new URLSearchParams(location.search);
      current.set('q', q);
      navigate(`${location.pathname}?${current.toString()}`);
    } else {
      navigate(location.pathname);
    }
  };

  const isHome = location.pathname === '/';
  const isExplore = location.pathname === '/explore';
  const activeCategory = urlParams.get('category');

  return (
    <div className="navbar-wrapper">
      <nav className="navbar olx-navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <i className="fas fa-recycle logo-icon"></i>
            SwapIt
          </Link>
          <div className="navbar-location" onClick={() => setLocationFilter(locationFilter === 'India' ? 'All India' : 'India')}>
            <i className="fas fa-map-marker-alt location-icon"></i>
            <span>{locationFilter}</span>
            <i className="fas fa-chevron-down dropdown-arrow"></i>
          </div>
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={`Search 'Mobiles', 'Books', 'Electronics'...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-olx"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </form>
          <div className="navbar-actions">
            <Link to="/profile" className="nav-action-link" title="Profile / Wishlist">
              <i className="fas fa-heart action-icon"></i>
              <span className="action-label">Wishlist</span>
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="nav-action-link">
                  <i className="fas fa-user action-icon"></i>
                  <span className="action-label">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="nav-action-link btn-text">
                  Logout
                </button>
                <Link to="/items/create" className="btn-sell">
                  + ADD ITEM
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-action-link">
                  <i className="fas fa-user action-icon"></i>
                  <span className="action-label">Login</span>
                </Link>
                <Link to="/items/create" className="btn-sell">
                  + ADD ITEM
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="navbar-secondary">
        <div className="secondary-inner">
          <div className="categories-wrapper">
            <button
              className={`btn-all-categories ${showCategories ? 'active' : ''}`}
              onClick={() => setShowCategories(!showCategories)}
            >
              <i className="fas fa-bars hamburger"></i> ALL CATEGORIES
            </button>
            {showCategories && (
              <div className="categories-dropdown">
                <div className="categories-grid">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      to={`/?category=${cat.value}`}
                      className="category-item"
                      onClick={() => setShowCategories(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={isHome ? `/?category=${cat.value}` : `/explore?category=${cat.value}`}
                className={`pill ${activeCategory === cat.value ? 'active' : ''}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="secondary-links">
            <Link to="/" className={isHome ? 'active' : ''}>Feed</Link>
            <Link to="/explore" className={isExplore ? 'active' : ''}>Explore</Link>
            {user && <Link to="/swaps">My Swaps</Link>}
            {user && <Link to="/notifications"><i className="fas fa-bell"></i></Link>}
          </div>
          <span className="date-display">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
