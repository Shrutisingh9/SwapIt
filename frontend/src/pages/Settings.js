import React, { useState, useEffect } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    swapNotifications: true,
    chatNotifications: true,
    profileVisibility: 'public',
    showPhone: false,
    showEmail: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load user settings if available
    // In a real app, fetch from backend
  }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="settings-container">
        <div className="settings-content">
          <h1 className="settings-title">
            <i className="fas fa-cog"></i> Settings
          </h1>

          <div className="settings-section">
            <h2><i className="fas fa-bell"></i> Notifications</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive notifications via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Push Notifications</h3>
                <p>Receive browser push notifications</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Swap Notifications</h3>
                <p>Get notified about swap requests and updates</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.swapNotifications}
                  onChange={(e) => handleChange('swapNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Chat Notifications</h3>
                <p>Get notified about new messages</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.chatNotifications}
                  onChange={(e) => handleChange('chatNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h2><i className="fas fa-user-shield"></i> Privacy</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Profile Visibility</h3>
                <p>Who can see your profile</p>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
                className="settings-select"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Show Phone Number</h3>
                <p>Display your phone number on your profile</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showPhone}
                  onChange={(e) => handleChange('showPhone', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Show Email</h3>
                <p>Display your email on your profile</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={(e) => handleChange('showEmail', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h2><i className="fas fa-shield-alt"></i> Security</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </div>
              <button className="btn btn-secondary">Change Password</button>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security</p>
              </div>
              <button className="btn btn-secondary">Enable 2FA</button>
            </div>
          </div>

          <div className="settings-actions">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="loading"></span> Saving...
                </>
              ) : saved ? (
                <>
                  <i className="fas fa-check"></i> Saved!
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
