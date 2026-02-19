import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from '../components/ProfileSidebar';
import { Skeleton } from '../components/Skeleton';
import './ProfileItems.css';

function ProfileItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/v1/users/me/items');
        setItems(res.data);
      } catch (e) {
        console.error('Failed to load items', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="profile-layout">
        <ProfileSidebar />
        <div className="profile-items-container">
          <div className="profile-items-content">
            <h1 className="page-title">My Items</h1>
            <div className="items-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="skeleton-item" style={{ height: 300 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="profile-items-container">
      <div className="profile-items-content">
        <div className="profile-items-header">
          <h1 className="page-title">
            <i className="fas fa-box"></i> My Items
          </h1>
          <Link to="/items/create" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="items-empty">
            <i className="fas fa-box-open"></i>
            <h3>No items yet</h3>
            <p>Start by adding your first item to swap or donate</p>
            <Link to="/items/create" className="btn btn-primary">
              <i className="fas fa-plus"></i> Add Your First Item
            </Link>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <Link key={item._id} to={`/items/${item._id}`} className="item-card">
                <div className="item-image">
                  {item.images?.[0] ? (
                    <img src={item.images[0].url} alt={item.title} />
                  ) : (
                    <div className="item-placeholder">
                      <i className="fas fa-image"></i>
                    </div>
                  )}
                  {item.isForDonation && (
                    <div className="item-badge">Donation</div>
                  )}
                </div>
                <div className="item-content">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-footer">
                    <span className="item-condition">{item.condition}</span>
                    {item.location && (
                      <span className="item-location">
                        <i className="fas fa-map-marker-alt"></i> {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default ProfileItems;
