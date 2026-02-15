import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { SkeletonDetail } from '../components/Skeleton';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchItem();
    if (user) {
      fetchMyItems();
      axios.get('/api/v1/users/me').then((res) => {
        const ids = (res.data?.user?.savedItems || []).map((sid) => (sid?._id || sid).toString());
        setIsSaved(ids.includes(id));
      }).catch(() => {});
    } else {
      setIsSaved(false);
    }
  }, [id, user]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/api/v1/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyItems = async () => {
    try {
      const response = await axios.get('/api/v1/items', { params: { q: '' } });
      const myOwnedItems = response.data.filter((i) => {
        const ownerId = i.ownerId?._id || i.ownerId;
        return ownerId === user?.id;
      });
      setMyItems(myOwnedItems);
    } catch (error) {
      console.error('Failed to fetch my items:', error);
    }
  };

  const handleSwapRequest = async () => {
    if (!selectedItemId) {
      alert('Please select an item to offer');
      return;
    }
    setSending(true);
    try {
      await axios.post('/api/v1/swaps', {
        requestedItemId: id,
        offeredItemId: selectedItemId
      });
      alert('Swap request sent successfully.');
      navigate('/swaps');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create swap request');
    } finally {
      setSending(false);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await axios.post(`/api/v1/users/me/wishlist/${id}`);
      setIsSaved((prev) => !prev);
    } catch (e) {
      console.error('Failed to toggle wishlist', e);
    }
  };

  const handleChatWithOwner = async () => {
    if (!user || !item?.ownerId) return;
    const ownerId = item.ownerId._id || item.ownerId;
    if (ownerId === user.id) return;
    setChatLoading(true);
    try {
      const res = await axios.post('/api/v1/chat/direct', { otherUserId: ownerId, itemId: id });
      navigate(`/chat?id=${res.data._id}`);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to start chat');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <SkeletonDetail />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><i className="fas fa-times-circle"></i></div>
        <h3>Item not found</h3>
        <p>The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          <i className="fas fa-arrow-left"></i> Back to Browse
        </Link>
      </div>
    );
  }

  const ownerId = item.ownerId?._id || item.ownerId;
  const isOwner = user && ownerId === user.id;

  return (
    <div className="fade-in">
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-lg)',
              background: 'linear-gradient(135deg, #6B8E74 0%, #A3B18A 100%)',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user && !isOwner && (
                <button
                  className={`olx-card-wishlist ${isSaved ? 'wishlist-active' : ''}`}
                  onClick={toggleWishlist}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                  style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
                >
                  <i className={isSaved ? 'fas fa-heart' : 'far fa-heart'}></i>
                </button>
              )}
              {item.images && item.images.length > 0 ? (
                <img 
                  src={item.images[0].url} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ fontSize: '80px', color: 'rgba(255, 255, 255, 0.7)' }}><i className="fas fa-box-open"></i></div>
              )}
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
              {item.title}
            </h1>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {item.description}
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                padding: '16px', 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary-color)' }}>
                  <i className="fas fa-tag"></i> {item.category}
                </div>
              </div>
              <div style={{ 
                padding: '16px', 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Condition</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--success-color)' }}>
                  <i className="fas fa-check-circle"></i> {item.condition}
                </div>
              </div>
            </div>

            {item.location && (
              <div style={{ 
                padding: '16px', 
                background: 'var(--bg-color)',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-map-marker-alt" style={{ fontSize: '16px' }}></i>
                <span style={{ fontWeight: '600' }}>{item.location}</span>
              </div>
            )}

            <div style={{ 
              padding: '24px', 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(99, 102, 241, 0.1)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-user"></i> Owner Information
              </h3>
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <strong style={{ fontSize: '18px' }}>{item.ownerId?.name}</strong>
                {user && !isOwner && (
                  <button
                    onClick={handleChatWithOwner}
                    disabled={chatLoading}
                    className="btn btn-primary"
                  >
                    {chatLoading ? (
                      <><span className="loading" style={{ width: '18px', height: '18px' }}></span> Connecting...</>
                    ) : (
                      <><i className="fas fa-comments"></i> Chat</>
                    )}
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span className="item-owner-rating" style={{ fontSize: '16px' }}>
                  <i className="fas fa-star"></i> {item.ownerId?.rating?.toFixed(1) || '0.0'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  ({item.ownerId?.ratingCount || 0} ratings)
                </span>
              </div>
              {item.ownerId?.location && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fas fa-map-marker-alt"></i> {item.ownerId.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {user && !isOwner && (
        <div className="card">
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-comments"></i> Request Swap
          </h2>
          {myItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--text-secondary)' }}><i className="fas fa-box-open"></i></div>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                You need to add an item first to request a swap.
              </p>
              <Link to="/items/create" className="btn btn-primary">
                <i className="fas fa-plus"></i> Add Your First Item
              </Link>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Select an item to offer:</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">Choose an item to swap...</option>
                  {myItems.map((myItem) => (
                    <option key={myItem._id} value={myItem._id}>
                      {myItem.title}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleSwapRequest} 
                className="btn btn-primary"
                disabled={sending || !selectedItemId}
                style={{ width: '100%' }}
              >
                {sending ? (
                  <>
                    <span className="loading"></span>
                    <span>Sending request...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>Send Swap Request</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}
      {user && (
        <div className="card" style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Safety & Reporting</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Meet in public places and never share sensitive personal information. If you see something suspicious, report it.
          </p>
          <button
            className="btn btn-secondary"
            onClick={async () => {
              try {
                await axios.post('/api/v1/reports', {
                  targetItemId: id,
                  reason: 'Inappropriate or suspicious item',
                  details: ''
                });
                alert('Thanks, we have received your report.');
              } catch (e) {
                alert('Failed to send report.');
              }
            }}
          >
            <i className="fas fa-flag"></i> Report this item
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;
