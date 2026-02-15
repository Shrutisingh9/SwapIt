import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { SkeletonItemGrid } from '../components/Skeleton';
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

function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    fetchItems();
  }, [q, category]);

  useEffect(() => {
    if (user) {
      axios.get('/api/v1/users/me').then((res) => {
        const ids = (res.data?.user?.savedItems || []).map((id) => (id?._id || id).toString());
        setSavedIds(new Set(ids));
      }).catch(() => {});
    } else {
      setSavedIds(new Set());
    }
  }, [user]);

  const toggleWishlist = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      await axios.post(`/api/v1/users/me/wishlist/${itemId}`);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) next.delete(itemId);
        else next.add(itemId);
        return next;
      });
    } catch (e) {
      console.error('Failed to toggle wishlist', e);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (q) params.q = q;
      if (category) params.category = category;
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
      <div className="home-olx fade-in">
        <h2 className="section-title">Fresh recommendations</h2>
        <SkeletonItemGrid count={12} />
      </div>
    );
  }

  return (
    <div className="home-olx fade-in">
      <h2 className="section-title">Fresh recommendations</h2>

      {items.length === 0 ? (
        <div className="no-items-olx">
          <div className="no-items-icon"><i className="fas fa-search"></i></div>
          <h3>No items found</h3>
          <p>Try adjusting your search or category filter</p>
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
                    className={`olx-card-wishlist ${savedIds.has(item._id) ? 'wishlist-active' : ''}`}
                    onClick={(e) => toggleWishlist(e, item._id)}
                    aria-label={savedIds.has(item._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <i className={savedIds.has(item._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                  </button>
                  {(item.isForDonation || item.isForSwap) && (
                    <span className="olx-card-badge">
                      {item.isForDonation ? 'DONATE' : 'SWAP'}
                    </span>
                  )}
                </div>
                <div className="olx-card-body">
                  <div className="olx-card-price">
                    {item.isForDonation ? 'Free' : 'Swap'}
                  </div>
                  <h3 className="olx-card-title">{item.title}</h3>
                  {item.condition && (
                    <p className="olx-card-subtitle">{item.condition} • {item.category}</p>
                  )}
                  <p className="olx-card-location">
                    {item.location || 'Location not specified'}
                  </p>
                  <p className="olx-card-date">{formatDate(item.createdAt)}</p>
                </div>
              </Link>
            ))}
            <div className="olx-cta-banner">
              <i className="fas fa-plus-circle cta-icon"></i>
              <h3>Want to see your stuff here?</h3>
              <p>Make some extra impact by swapping or donating things in your community. Go on, it's quick and easy.</p>
              <Link to="/items/create" className="btn-cta">Start listing</Link>
            </div>
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

export default Home;
