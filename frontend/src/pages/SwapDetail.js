import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';

function SwapDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [swap, setSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSwap();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (roomId && token) {
      const newSocket = io('http://localhost:4000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        newSocket.emit('joinRoom', roomId);
      });

      newSocket.on('newMessage', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSwap = async () => {
    try {
      const response = await axios.get('/api/v1/swaps');
      const swapData = response.data.find((s) => s._id === id);
      setSwap(swapData);

      if (swapData && swapData.chatRoomId) {
        const chatRoomResponse = await axios.get(`/api/v1/chat/rooms/${swapData.chatRoomId}/messages`);
        setMessages(chatRoomResponse.data);
        setRoomId(swapData.chatRoomId);
      }
    } catch (error) {
      console.error('Failed to fetch swap:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !roomId) return;

    try {
      if (socket) {
        socket.emit('sendMessage', { roomId, body: newMessage });
        setNewMessage('');
      } else {
        await axios.post(`/api/v1/chat/rooms/${roomId}/messages`, { body: newMessage });
        setNewMessage('');
        fetchSwap();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleAction = async (action) => {
    try {
      await axios.post(`/api/v1/swaps/${id}/${action}`);
      fetchSwap();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${action} swap`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-warning', icon: '⏳', text: 'Pending' },
      ACCEPTED: { class: 'badge-success', icon: '✅', text: 'Accepted' },
      REJECTED: { class: 'badge-danger', icon: '❌', text: 'Rejected' },
      CANCELLED: { class: 'badge-danger', icon: '🚫', text: 'Cancelled' },
      COMPLETED: { class: 'badge-success', icon: '🎉', text: 'Completed' }
    };
    const badge = badges[status] || badges.PENDING;
    return <span className={`badge ${badge.class}`} style={{ fontSize: '14px', padding: '8px 16px' }}>{badge.icon} {badge.text}</span>;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="loading" style={{ width: '50px', height: '50px', margin: '0 auto' }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading swap details...</p>
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3>Swap not found</h3>
        <p>The swap you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isMyMessage = (msg) => msg.senderId?._id === user?.id || msg.senderId === user?.id;

  return (
    <div className="fade-in">
      <h1 className="page-title">💼 Swap Details</h1>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Swap Information</h2>
          {getStatusBadge(swap.status)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(99, 102, 241, 0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              🎯 Requested Item
            </h3>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-color)' }}>
              {swap.requestedItemId?.title || 'Loading...'}
            </div>
          </div>
          <div style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              💎 Offered Item
            </h3>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success-color)' }}>
              {swap.offeredItemId?.title || 'Loading...'}
            </div>
          </div>
        </div>

        {swap.status === 'PENDING' && swap.responderId === user?.id && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={() => handleAction('accept')} className="btn btn-success">
              ✅ Accept Swap
            </button>
            <button onClick={() => handleAction('reject')} className="btn btn-danger">
              ❌ Reject Swap
            </button>
          </div>
        )}
        {swap.status === 'ACCEPTED' && (
          <div style={{ marginTop: '16px' }}>
            <button onClick={() => handleAction('complete')} className="btn btn-success">
              🎉 Mark Swap as Complete
            </button>
          </div>
        )}
      </div>

      {roomId && (
        <div className="card">
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💬 Chat Room
          </h2>
          <div style={{ 
            height: '450px', 
            overflowY: 'auto', 
            border: '2px solid var(--border-color)', 
            borderRadius: '12px',
            padding: '20px', 
            marginBottom: '16px',
            background: 'var(--bg-color)'
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg._id} 
                  style={{ 
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: isMyMessage(msg) ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: isMyMessage(msg) 
                      ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)'
                      : 'var(--card-bg)',
                    color: isMyMessage(msg) ? 'white' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    border: isMyMessage(msg) ? 'none' : '1px solid var(--border-color)'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      marginBottom: '4px',
                      opacity: 0.8
                    }}>
                      {msg.senderId?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '15px', lineHeight: '1.5' }}>
                      {msg.body}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      marginTop: '4px',
                      opacity: 0.7
                    }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="form-group"
              style={{ flex: 1, margin: 0 }}
            />
            <button onClick={sendMessage} className="btn btn-primary">
              📤 Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwapDetail;
