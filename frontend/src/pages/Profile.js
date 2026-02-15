import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/Skeleton';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', location: '', gender: '', dateOfBirth: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

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
        setEditForm({
          name: user.name || '',
          bio: user.bio || '',
          location: user.location || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          phone: user.phone || ''
        });
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setSaving(true);
    try {
      const res = await axios.patch('/api/v1/users/me', {
        name: editForm.name || undefined,
        bio: editForm.bio || undefined,
        location: editForm.location || undefined,
        gender: editForm.gender || undefined,
        dateOfBirth: editForm.dateOfBirth || undefined,
        phone: editForm.phone || undefined
      });
      setProfile((p) => ({ ...p, user: { ...p.user, ...res.data } }));
      setEditOpen(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title"><i className="fas fa-user"></i> Profile</h1>
        <div className="card">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
            <Skeleton className="skeleton-avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <Skeleton className="skeleton-line" style={{ width: 200, height: 28, marginBottom: 16 }} />
              <Skeleton className="skeleton-line" style={{ width: '80%', marginBottom: 8 }} />
              <Skeleton className="skeleton-line short" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-empty">
        <div className="profile-empty-icon"><i className="fas fa-times-circle"></i></div>
        <h3>Profile not found</h3>
      </div>
    );
  }

  const { user, stats } = profile;

  return (
    <div className="profile-instagram fade-in">
      {/* Header - Instagram style */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} />
          ) : (
            <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-username">{user.name}</h1>
          <button className="profile-edit-btn" onClick={() => {
            setEditForm({
              name: user.name || '',
              bio: user.bio || '',
              location: user.location || '',
              gender: user.gender || '',
              dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
              phone: user.phone || ''
            });
            setEditOpen(true);
          }}>
            Edit Profile
          </button>
          <div className="profile-stats">
            <span><strong>{items.length}</strong> Items</span>
            <span><strong>{stats?.totalSwaps || 0}</strong> Swaps</span>
            <span><strong>{stats?.totalDonations || 0}</strong> Donations</span>
          </div>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          {user.location && (
            <p className="profile-location"><i className="fas fa-map-marker-alt"></i> {user.location}</p>
          )}
          {!user.location && (
            <p className="profile-location-hint"><i className="fas fa-map-marker-alt"></i> Add your city in Edit Profile</p>
          )}
          {user.phone && <p className="profile-meta"><i className="fas fa-phone"></i> {user.phone}</p>}
          {user.gender && <p className="profile-meta">{user.gender}</p>}
          {user.dateOfBirth && (
            <p className="profile-meta">Born {new Date(user.dateOfBirth).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          )}
          <p className="profile-rating"><i className="fas fa-star"></i> {user.rating?.toFixed(1) || '0.0'} ({user.ratingCount || 0} ratings)</p>
        </div>
      </div>

      {/* Tabs & Grid - Instagram style */}
      <div className="profile-tabs">
        <div className="profile-tab active">Items</div>
      </div>
      <div className="profile-grid">
        {items.length === 0 ? (
          <div className="profile-grid-empty">
            <p>No items yet</p>
            <Link to="/items/create" className="profile-add-link">Add your first item</Link>
          </div>
        ) : (
          items.map((item) => (
            <Link key={item._id} to={`/items/${item._id}`} className="profile-grid-item">
              {item.images?.[0] ? (
                <img src={item.images[0].url} alt={item.title} />
              ) : (
                <div className="profile-grid-placeholder"><i className="fas fa-box-open"></i></div>
              )}
            </Link>
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="profile-modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            {editError && <div className="alert alert-error">{editError}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label><i className="fas fa-user"></i> Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-align-left"></i> Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-phone"></i> Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                />
                <small className="form-hint">Phone is private and hidden from others by default (like WhatsApp).</small>
              </div>
              <div className="form-group">
                <label><i className="fas fa-map-marker-alt"></i> City</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                />
                <small className="form-hint">City name only</small>
              </div>
              <div className="form-group">
                <label><i className="fas fa-venus-mars"></i> Gender</label>
                <div className="radio-group">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={editForm.gender === g}
                        onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label><i className="fas fa-calendar-alt"></i> Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="profile-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
