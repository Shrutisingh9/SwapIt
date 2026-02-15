import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { SkeletonItemGrid } from '../components/Skeleton';
import './Home.css';

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

function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/v1/users/me/wishlist');
      setItems(res.data || []);
    } catch (e) {
      console.error('Failed to load wishlist', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.post(`/api/v1/users/me/wishlist/${itemId}`);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (e) {
      console.error('Failed to remove from wishlist', e);
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title"><i className="fas fa-heart"></i> My Wishlist</h1>
        <SkeletonItemGrid count={6} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title"><i className="fas fa-heart"></i> My Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="far fa-heart"></i></div>
          <h3>No items in wishlist</h3>
          <p>Add items by clicking the heart icon on any item.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            <i className="fas fa-search"></i> Browse Items
          </Link>
        </div>
      ) : (
        <div className="olx-grid">
          {items.map((item) => (
            <Link key={item._id} to={`/items/${item._id}`} className="olx-card">
              <div className="olx-card-image">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0].url} alt={item.title} />
                ) : (
                  <div className="olx-card-placeholder"><i className="fas fa-box-open"></i></div>
                )}
                <button
                  className="olx-card-wishlist wishlist-active"
                  onClick={(e) => handleRemove(e, item._id)}
                  aria-label="Remove from wishlist"
                >
                  <i className="fas fa-heart"></i>
                </button>
                {(item.isForDonation || item.isForSwap) && (
                  <span className="olx-card-badge">
                    {item.isForDonation ? 'DONATE' : 'SWAP'}
                  </span>
                )}
              </div>
              <div className="olx-card-body">
                <div className="olx-card-price">{item.isForDonation ? 'Free' : 'Swap'}</div>
                <h3 className="olx-card-title">{item.title}</h3>
                {item.condition && (
                  <p className="olx-card-subtitle">{item.condition} • {item.category}</p>
                )}
                <p className="olx-card-location">{item.location || 'Location not specified'}</p>
                <p className="olx-card-date">{formatDate(item.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
