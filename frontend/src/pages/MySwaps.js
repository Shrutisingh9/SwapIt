import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function MySwaps() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      const response = await axios.get('/api/v1/swaps');
      setSwaps(response.data);
    } catch (error) {
      console.error('Failed to fetch swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (swapId, action) => {
    try {
      await axios.post(`/api/v1/swaps/${swapId}/${action}`);
      fetchSwaps();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${action} swap`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-warning', icon: 'fa-clock', text: 'Pending' },
      ACCEPTED: { class: 'badge-success', icon: 'fa-check', text: 'Accepted' },
      REJECTED: { class: 'badge-danger', icon: 'fa-times', text: 'Rejected' },
      CANCELLED: { class: 'badge-danger', icon: 'fa-ban', text: 'Cancelled' },
      COMPLETED: { class: 'badge-success', icon: 'fa-check-double', text: 'Completed' }
    };
    const badge = badges[status] || badges.PENDING;
    return <span className={`badge ${badge.class}`}><i className={`fas ${badge.icon}`}></i> {badge.text}</span>;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="loading" style={{ width: '50px', height: '50px', margin: '0 auto' }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading your swaps...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title"><i className="fas fa-exchange-alt"></i> My Swaps</h1>
      
      {swaps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fas fa-exchange-alt"></i></div>
          <h3>No swaps yet</h3>
          <p>Start browsing items to create your first swap!</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            <i className="fas fa-arrow-right"></i> Browse Items
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {swaps.map((swap) => {
            const requestedItem = swap.requestedItemId;
            const offeredItem = swap.offeredItemId;
            const requestedOwnerId = requestedItem?.ownerId?._id || requestedItem?.ownerId;
            const isRequester = user?.id === requestedOwnerId;

            return (
              <div key={swap._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                      Swap Request
                    </h2>
                    {getStatusBadge(swap.status)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(swap.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ 
                    padding: '20px', 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%)',
                    borderRadius: '12px',
                    border: '2px solid rgba(99, 102, 241, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                      🎯 Requested Item
                    </h3>
                    <Link 
                      to={`/items/${requestedItem?._id || requestedItem}`}
                      style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: 'var(--primary-color)',
                        textDecoration: 'none'
                      }}
                    >
                      {requestedItem?.title || 'Loading...'}
                    </Link>
                  </div>
                  <div style={{ 
                    padding: '20px', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                    borderRadius: '12px',
                    border: '2px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                      💎 Your Offer
                    </h3>
                    <Link 
                      to={`/items/${offeredItem?._id || offeredItem}`}
                      style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: 'var(--success-color)',
                        textDecoration: 'none'
                      }}
                    >
                      {offeredItem?.title || 'Loading...'}
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to={`/swaps/${swap._id}`} className="btn btn-primary">
                    💬 View Details & Chat
                  </Link>
                  {swap.status === 'PENDING' && !isRequester && (
                    <>
                      <button 
                        onClick={() => handleAction(swap._id, 'accept')} 
                        className="btn btn-success"
                      >
                        ✅ Accept
                      </button>
                      <button 
                        onClick={() => handleAction(swap._id, 'reject')} 
                        className="btn btn-danger"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {swap.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => handleAction(swap._id, 'complete')} 
                      className="btn btn-success"
                    >
                      🎉 Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MySwaps;
