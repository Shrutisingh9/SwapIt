import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/v1/notifications');
        setNotifications(res.data || []);
      } catch (e) {
        console.error('Failed to load notifications', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="loading" style={{ width: '50px', height: '50px', margin: '0 auto' }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title"><i className="fas fa-bell"></i> Notifications</h1>
      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fas fa-check-circle"></i></div>
          <h3>All caught up</h3>
          <p>No new notifications right now.</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n._id} className="card">
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
            <div style={{ marginTop: '8px', fontSize: '16px' }}>{n.message}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;

