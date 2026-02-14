import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const ITEMS_PER_PAGE = 12;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }).toUpperCase();
}

function Explore() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    fetchItems();
  }, [q, category, type]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
      if (type !== 'all') params.type = type;
      const response = await axios.get('/api/v1/items', { params });
      setItems(response.data);
      setDisplayCount(ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleItems = items.slice(0, displayCount);
  const hasMore = items.length > displayCount;

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading" style={{ width: '50px', height: '50px' }}></div>
        <p>Finding items...</p>
      </div>
    );
  }

  return (
    <div className="home-olx fade-in">
      <h2 className="section-title">Explore items</h2>

      <div className="explore-filters">
        <Link
          to={`/explore?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), type: 'all' }).toString()}`}
          className={`filter-pill ${type === 'all' ? 'active' : ''}`}
        >
          All
        </Link>
        <Link
          to={`/explore?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), type: 'swap' }).toString()}`}
          className={`filter-pill ${type === 'swap' ? 'active' : ''}`}
        >
          Swap
        </Link>
        <Link
          to={`/explore?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), type: 'donation' }).toString()}`}
          className={`filter-pill ${type === 'donation' ? 'active' : ''}`}
        >
          Donation
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="no-items-olx">
          <div className="no-items-icon"><i className="fas fa-search"></i></div>
          <h3>No items found</h3>
          <p>Try changing your filters.</p>
        </div>
      ) : (
        <>
          <div className="olx-grid">
            {visibleItems.map((item) => (
              <Link key={item._id} to={`/items/${item._id}`} className="olx-card">
                <div className="olx-card-image">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0].url} alt={item.title} />
                  ) : (
                    <div className="olx-card-placeholder"><i className="fas fa-box-open"></i></div>
                  )}
                  <button
                    className="olx-card-wishlist"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    aria-label="Add to wishlist"
                  >
                    <i className="far fa-heart"></i>
                  </button>
                  <span className="olx-card-badge">
                    {item.isForDonation ? 'DONATE' : 'SWAP'}
                  </span>
                </div>
                <div className="olx-card-body">
                  <div className="olx-card-price">
                    {item.isForDonation ? 'Free' : 'Swap'}
                  </div>
                  <h3 className="olx-card-title">{item.title}</h3>
                  <p className="olx-card-subtitle">{item.condition} • {item.category}</p>
                  <p className="olx-card-location">{item.location || 'Location not specified'}</p>
                  <p className="olx-card-date">{formatDate(item.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="load-more-wrapper">
              <button
                className="btn-load-more"
                onClick={() => setDisplayCount((c) => c + ITEMS_PER_PAGE)}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Explore;
