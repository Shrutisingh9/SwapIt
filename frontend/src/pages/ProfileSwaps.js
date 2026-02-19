import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import { SkeletonSwapCard } from '../components/Skeleton';
import './ProfileSwaps.css';

function ProfileSwaps() {
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
      <div className="profile-layout">
        <ProfileSidebar />
        <div className="profile-swaps-container">
          <div className="profile-swaps-content">
            <h1 className="page-title">My Swaps</h1>
            <SkeletonSwapCard />
            <SkeletonSwapCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="profile-swaps-container">
      <div className="profile-swaps-content">
        <h1 className="page-title">
          <i className="fas fa-exchange-alt"></i> My Swaps
        </h1>

        {swaps.length === 0 ? (
          <div className="swaps-empty">
            <i className="fas fa-exchange-alt"></i>
            <h3>No swaps yet</h3>
            <p>Start swapping items with other users</p>
            <Link to="/explore" className="btn btn-primary">
              <i className="fas fa-compass"></i> Explore Items
            </Link>
          </div>
        ) : (
          <div className="swaps-list">
            {swaps.map((swap) => {
              const isRequester = swap.requesterId?._id === user?.id || swap.requesterId === user?.id;
              const otherUser = isRequester ? swap.ownerId : swap.requesterId;
              const requestedItem = swap.requestedItemId;
              const offeredItem = swap.offeredItemId;

              return (
                <div key={swap._id} className="swap-card">
                  <div className="swap-header">
                    <div className="swap-status">{getStatusBadge(swap.status)}</div>
                    <Link to={`/swaps/${swap._id}`} className="btn btn-sm btn-secondary">
                      View Details
                    </Link>
                  </div>
                  <div className="swap-items">
                    <div className="swap-item">
                      <h4>You {isRequester ? 'Requested' : 'Offered'}</h4>
                      <Link to={`/items/${requestedItem?._id || requestedItem}`} className="item-link">
                        {requestedItem?.images?.[0] ? (
                          <img src={requestedItem.images[0].url} alt={requestedItem.title} />
                        ) : (
                          <div className="item-placeholder"><i className="fas fa-box"></i></div>
                        )}
                        <span>{requestedItem?.title || 'Item'}</span>
                      </Link>
                    </div>
                    <div className="swap-arrow">
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                    <div className="swap-item">
                      <h4>{otherUser?.name || 'User'} {isRequester ? 'Offered' : 'Requested'}</h4>
                      <Link to={`/items/${offeredItem?._id || offeredItem}`} className="item-link">
                        {offeredItem?.images?.[0] ? (
                          <img src={offeredItem.images[0].url} alt={offeredItem.title} />
                        ) : (
                          <div className="item-placeholder"><i className="fas fa-box"></i></div>
                        )}
                        <span>{offeredItem?.title || 'Item'}</span>
                      </Link>
                    </div>
                  </div>
                  {swap.status === 'PENDING' && !isRequester && (
                    <div className="swap-actions">
                      <button
                        onClick={() => handleAction(swap._id, 'accept')}
                        className="btn btn-success"
                      >
                        <i className="fas fa-check"></i> Accept
                      </button>
                      <button
                        onClick={() => handleAction(swap._id, 'reject')}
                        className="btn btn-danger"
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default ProfileSwaps;
