import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import { SkeletonSwapCard } from '../components/Skeleton';
import './SwapDetail.css';

function SwapDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [swap, setSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSwap();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (roomId && token) {
      const apiUrl = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000');
      const newSocket = io(apiUrl, { auth: { token } });

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
      const response = await axios.get(`/api/v1/swaps/${id}`);
      const swapData = response.data;
      setSwap(swapData);

      if (swapData?.chatRoomId) {
        const chatRoomResponse = await axios.get(`/api/v1/chat/rooms/${swapData.chatRoomId}/messages`);
        setMessages(chatRoomResponse.data || []);
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
      <div className="fade-in">
        <h1 className="page-title"><i className="fas fa-exchange-alt"></i> Swap Details</h1>
        <SkeletonSwapCard />
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="swap-detail-empty">
        <div className="empty-state-icon"><i className="fas fa-times-circle"></i></div>
        <h3>Swap not found</h3>
        <p>The swap you're looking for doesn't exist.</p>
      </div>
    );
  }

  const responderIdStr = swap.responderId?._id?.toString() || swap.responderId?.toString();
  const isResponder = user?.id === responderIdStr;
  const requestedItem = swap.requestedItemId;
  const offeredItem = swap.offeredItemId;

  // My Item vs Their Item: requester offers offeredItem, responder owns requestedItem
  const myItem = isResponder ? requestedItem : offeredItem;
  const theirItem = isResponder ? offeredItem : requestedItem;
  const otherUser = isResponder ? swap.requesterId : swap.responderId;

  const isMyMessage = (msg) => msg.senderId?._id === user?.id || msg.senderId === user?.id;

  return (
    <div className="swap-detail fade-in">
      <h1 className="page-title"><i className="fas fa-exchange-alt"></i> Swap Details</h1>

      {/* Tabs: Details | Chat */}
      <div className="swap-detail-tabs">
        <button
          className={`swap-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <i className="fas fa-info-circle"></i> Details
        </button>
        <button
          className={`swap-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <i className="fas fa-comments"></i> Chat
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="swap-detail-card">
          <div className="swap-detail-header">
            <h2>Swap Information</h2>
            {getStatusBadge(swap.status)}
          </div>

          {/* Item Comparison - My Item vs Their Item */}
          <h3 className="swap-comparison-title"><i className="fas fa-balance-scale"></i> Item Comparison</h3>
          <div className="swap-comparison">
            <div className="swap-item-card my-item">
              <h4><i className="fas fa-user"></i> My Item</h4>
              <div className="swap-item-image">
                {myItem?.images?.[0] ? (
                  <img src={myItem.images[0].url} alt={myItem.title} />
                ) : (
                  <div className="swap-item-placeholder"><i className="fas fa-box-open"></i></div>
                )}
              </div>
              <Link to={`/items/${myItem?._id}`} className="swap-item-title">{myItem?.title || 'Loading...'}</Link>
              <p className="swap-item-meta">{myItem?.condition} • {myItem?.category}</p>
              {myItem?.location && <p className="swap-item-location"><i className="fas fa-map-marker-alt"></i> {myItem.location}</p>}
              <Link to={`/items/${myItem?._id}`} className="swap-item-link">View full details</Link>
            </div>
            <div className="swap-comparison-vs">VS</div>
            <div className="swap-item-card their-item">
              <h4><i className="fas fa-user-friends"></i> Their Item ({otherUser?.name || 'Other user'})</h4>
              <div className="swap-item-image">
                {theirItem?.images?.[0] ? (
                  <img src={theirItem.images[0].url} alt={theirItem.title} />
                ) : (
                  <div className="swap-item-placeholder"><i className="fas fa-box-open"></i></div>
                )}
              </div>
              <Link to={`/items/${theirItem?._id}`} className="swap-item-title">{theirItem?.title || 'Loading...'}</Link>
              <p className="swap-item-meta">{theirItem?.condition} • {theirItem?.category}</p>
              {theirItem?.location && <p className="swap-item-location"><i className="fas fa-map-marker-alt"></i> {theirItem.location}</p>}
              <Link to={`/items/${theirItem?._id}`} className="swap-item-link">View full details</Link>
            </div>
          </div>

          {swap.status === 'PENDING' && isResponder && (
            <div className="swap-actions">
              <button onClick={() => handleAction('accept')} className="btn btn-success">
                <i className="fas fa-check"></i> Accept Swap
              </button>
              <button onClick={() => handleAction('reject')} className="btn btn-danger">
                <i className="fas fa-times"></i> Reject Swap
              </button>
            </div>
          )}
          {swap.status === 'ACCEPTED' && (
            <div className="swap-actions">
              <button onClick={() => handleAction('complete')} className="btn btn-success">
                <i className="fas fa-check-double"></i> Mark Swap as Complete
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="swap-detail-card swap-chat-card">
          <h2><i className="fas fa-comments"></i> Chat with {otherUser?.name || 'swap partner'}</h2>
          {roomId ? (
            <>
              <div className="swap-chat-messages">
                {messages.length === 0 ? (
                  <div className="swap-chat-empty">
                    <i className="fas fa-comment-dots"></i>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`swap-chat-message ${isMyMessage(msg) ? 'mine' : 'theirs'}`}
                    >
                      <div className="swap-chat-bubble">
                        <div className="swap-chat-sender">{msg.senderId?.name || 'Unknown'}</div>
                        <div className="swap-chat-body">{msg.body}</div>
                        <div className="swap-chat-time">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="swap-chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                />
                <button onClick={sendMessage} className="btn btn-primary">
                  <i className="fas fa-paper-plane"></i> Send
                </button>
              </div>
            </>
          ) : (
            <p className="swap-chat-no-room">Chat will be available after the swap is accepted.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SwapDetail;
