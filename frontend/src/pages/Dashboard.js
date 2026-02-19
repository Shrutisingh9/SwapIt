import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from '../components/ProfileSidebar';
import { Skeleton } from '../components/Skeleton';
import './Dashboard.css';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profileRes, itemsRes] = await Promise.all([
          axios.get('/api/v1/users/me'),
          axios.get('/api/v1/users/me/items')
        ]);
        const { user, stats } = profileRes.data;
        setProfile({ user, stats });
        setItems(itemsRes.data);
      } catch (e) {
        console.error('Failed to load profile', e);
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
        <div className="dashboard-container">
          <div className="dashboard-content">
            <Skeleton className="skeleton-line" style={{ width: 200, height: 40, marginBottom: 24 }} />
            <Skeleton className="skeleton-avatar" style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: 24 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-layout">
        <ProfileSidebar />
        <div className="dashboard-container">
          <div className="dashboard-content">
            <h2>Profile not found</h2>
          </div>
        </div>
      </div>
    );
  }

  const { user, stats } = profile;

  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <h1 className="dashboard-name">{user.name}</h1>
          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-number">{items.length}</div>
              <div className="stat-label">Items</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats?.totalSwaps || 0}</div>
              <div className="stat-label">Swaps</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats?.totalDonations || 0}</div>
              <div className="stat-label">Donations</div>
            </div>
          </div>
        </div>

        <div className="dashboard-info">
          <h2>Profile Information</h2>
          <div className="info-grid">
            {user.bio && (
              <div className="info-item">
                <i className="fas fa-align-left"></i>
                <div>
                  <div className="info-label">Bio</div>
                  <div className="info-value">{user.bio}</div>
                </div>
              </div>
            )}
            {user.location && (
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <div className="info-label">Location</div>
                  <div className="info-value">{user.location}</div>
                </div>
              </div>
            )}
            {user.phone && (
              <div className="info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <div className="info-label">Contact</div>
                  <div className="info-value">{user.phone}</div>
                </div>
              </div>
            )}
            {user.gender && (
              <div className="info-item">
                <i className="fas fa-venus-mars"></i>
                <div>
                  <div className="info-label">Gender</div>
                  <div className="info-value">{user.gender}</div>
                </div>
              </div>
            )}
            {user.dateOfBirth && (
              <div className="info-item">
                <i className="fas fa-calendar-alt"></i>
                <div>
                  <div className="info-label">Date of Birth</div>
                  <div className="info-value">
                    {new Date(user.dateOfBirth).toLocaleDateString('en-IN', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            )}
            {user.email && (
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <div className="info-label">Email</div>
                  <div className="info-value">{user.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/profile" className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit Profile
          </Link>
          <Link to="/profile/items" className="btn btn-secondary">
            <i className="fas fa-box"></i> View All Items
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
