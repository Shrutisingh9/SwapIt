import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import { Skeleton } from '../components/Skeleton';
import './Profile.css';

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
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
      window.location.reload();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-layout">
        <ProfileSidebar />
        <div className="profile-main">
          <Skeleton className="skeleton-line" style={{ width: 200, height: 40, marginBottom: 24 }} />
          <Skeleton className="skeleton-avatar" style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: 24 }} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-layout">
        <ProfileSidebar />
        <div className="profile-main">
          <h2>Profile not found</h2>
        </div>
      </div>
    );
  }

  const { user, stats } = profile;

  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="profile-main">
        <div className="profile-header-new">
          <div className="profile-avatar-new">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <h1 className="profile-name-new">{user.name}</h1>
          <div className="profile-stats-new">
            <div className="stat-item-new">
              <div className="stat-number-new">{items.length}</div>
              <div className="stat-label-new">Items</div>
            </div>
            <div className="stat-item-new">
              <div className="stat-number-new">{stats?.totalSwaps || 0}</div>
              <div className="stat-label-new">Swaps</div>
            </div>
            <div className="stat-item-new">
              <div className="stat-number-new">{stats?.totalDonations || 0}</div>
              <div className="stat-label-new">Donations</div>
            </div>
          </div>
        </div>

        <div className="profile-info-section">
          <h2>Profile Information</h2>
          <div className="info-grid-new">
            {user.bio && (
              <div className="info-item-new">
                <i className="fas fa-align-left"></i>
                <div>
                  <div className="info-label-new">Bio</div>
                  <div className="info-value-new">{user.bio}</div>
                </div>
              </div>
            )}
            {user.location && (
              <div className="info-item-new">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <div className="info-label-new">Location</div>
                  <div className="info-value-new">{user.location}</div>
                </div>
              </div>
            )}
            {user.phone && (
              <div className="info-item-new">
                <i className="fas fa-phone"></i>
                <div>
                  <div className="info-label-new">Contact</div>
                  <div className="info-value-new">{user.phone}</div>
                </div>
              </div>
            )}
            {user.gender && (
              <div className="info-item-new">
                <i className="fas fa-venus-mars"></i>
                <div>
                  <div className="info-label-new">Gender</div>
                  <div className="info-value-new">{user.gender}</div>
                </div>
              </div>
            )}
            {user.dateOfBirth && (
              <div className="info-item-new">
                <i className="fas fa-calendar-alt"></i>
                <div>
                  <div className="info-label-new">Date of Birth</div>
                  <div className="info-value-new">
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
              <div className="info-item-new">
                <i className="fas fa-envelope"></i>
                <div>
                  <div className="info-label-new">Email</div>
                  <div className="info-value-new">{user.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-actions-new">
          <button className="btn btn-primary" onClick={() => {
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
            <i className="fas fa-edit"></i> Edit Profile
          </button>
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
    </div>
  );
}

export default Profile;
