import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { INDIA_LOCATIONS, MAJOR_CITIES } from '../data/indiaLocation';
import './Navbar.css';

const CATEGORIES_PILLS = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Books', value: 'Books' }
];

const CATEGORIES_ALL = [
  { label: 'All', value: '' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Furniture', value: 'Furniture' },
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Books', value: 'Books' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Toys & Games', value: 'Toys & Games' },
  { label: 'Home & Kitchen', value: 'Home & Kitchen' },
  { label: 'Beauty', value: 'Beauty' },
  { label: 'Vehicles', value: 'Vehicles' },
  { label: 'Other', value: 'Other' }
];

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(urlParams.get('q') || '');
  const [locationLabel, setLocationLabel] = useState('All India');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearchQuery(p.get('q') || '');
  }, [location.search]);

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

  const handleLocationSelect = (label) => {
    setLocationLabel(label);
    setShowLocationDropdown(false);
  };

  // Combine all locations and sort alphabetically
  const allLocationsSorted = useMemo(() => {
    const all = [
      ...INDIA_LOCATIONS.map(loc => loc.label),
      ...MAJOR_CITIES
    ];
    return all.sort((a, b) => a.localeCompare(b));
  }, []);

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
          {!user && (
            <p className="navbar-tagline">Swap · Donate · Connect</p>
          )}
          <div className="navbar-location-wrap">
            <button
              type="button"
              className="navbar-location"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              aria-expanded={showLocationDropdown}
            >
              <i className="fas fa-map-marker-alt location-icon"></i>
              <span>{locationLabel}</span>
              <i className="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            {showLocationDropdown && (
              <>
                <div className="navbar-dropdown-backdrop" onClick={() => setShowLocationDropdown(false)} />
                <div className="navbar-location-dropdown">
                  {allLocationsSorted.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      className="location-option"
                      onClick={() => handleLocationSelect(loc)}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search items, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-olx"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
          <div className="navbar-actions">
            {user && (
              <Link to="/wishlist" className="nav-action-link" title="Wishlist">
                <i className="fas fa-heart action-icon"></i>
                <span className="action-label">Wishlist</span>
              </Link>
            )}
            {user ? (
              <Link to="/profile" className="nav-action-link">
                <i className="fas fa-user action-icon"></i>
                <span className="action-label">{user.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="nav-action-link">
                <i className="fas fa-sign-in-alt action-icon"></i>
                <span className="action-label">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="navbar-secondary">
        <div className="secondary-inner">
          <div className="categories-wrapper">
            <button
              type="button"
              className={`btn-all-categories ${showCategories ? 'active' : ''}`}
              onClick={() => setShowCategories(!showCategories)}
            >
              <i className="fas fa-bars hamburger"></i> ALL CATEGORIES
            </button>
            {showCategories && (
              <div className="categories-dropdown">
                <div className="categories-grid">
                  {CATEGORIES_ALL.map((cat) => (
                    <Link
                      key={cat.value || 'all'}
                      to={isHome ? (cat.value ? `/?category=${cat.value}` : '/') : (cat.value ? `/explore?category=${cat.value}` : '/explore')}
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
            {CATEGORIES_PILLS.map((cat) => (
              <Link
                key={cat.value || 'all'}
                to={isHome ? (cat.value ? `/?category=${cat.value}` : '/') : (cat.value ? `/explore?category=${cat.value}` : '/explore')}
                className={`pill ${(cat.value ? activeCategory === cat.value : !activeCategory) ? 'active' : ''}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="secondary-links">
            <Link to="/" className={isHome ? 'active' : ''}><i className="fas fa-home"></i> Feed</Link>
            <Link to="/explore" className={isExplore ? 'active' : ''}><i className="fas fa-compass"></i> Explore</Link>
            {user && <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''}><i className="fas fa-comments"></i> Chat</Link>}
            {user && <Link to="/swaps"><i className="fas fa-exchange-alt"></i> My Swaps</Link>}
            {user && <Link to="/notifications"><i className="fas fa-bell"></i> Notifications</Link>}
            <Link to="/items/create" className="btn-sell-secondary">
              <i className="fas fa-plus"></i> ADD ITEM
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
