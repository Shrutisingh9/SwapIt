import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import { SkeletonChat } from '../components/Skeleton';
import './Chat.css';

function Chat() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeId = searchParams.get('swap') || searchParams.get('id') || '';
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const active = conversations.find((c) => c._id === activeId || c.chatRoomId === activeId);
  const roomId = active?.chatRoomId || (activeId && /^[a-f0-9]{24}$/i.test(activeId) ? activeId : null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [roomId]);

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
      return () => newSocket.disconnect();
    }
  }, [roomId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/v1/chat/conversations');
      setConversations(res.data || []);
    } catch (e) {
      console.error('Failed to load conversations', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(`/api/v1/chat/rooms/${roomId}/messages`);
      setMessages(res.data || []);
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !roomId) return;
    try {
      if (socket) {
        socket.emit('sendMessage', { roomId, body: newMessage });
        setNewMessage('');
        fetchConversations();
      } else {
        await axios.post(`/api/v1/chat/rooms/${roomId}/messages`, { body: newMessage });
        setNewMessage('');
        fetchConversations();
        fetchMessages();
      }
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  const handleDeleteContact = async (e) => {
    e.preventDefault();
    if (!active?.otherUser?.id || !window.confirm('Remove this chat from your list? They won\'t be notified.')) return;
    try {
      await axios.delete(`/api/v1/chat/contacts/${active.otherUser.id}`);
      await fetchConversations();
      navigate('/chat');
    } catch (e) {
      console.error('Failed to delete contact', e);
    }
  };

  const isMyMessage = (msg) => msg.senderId?._id === user?.id || msg.senderId === user?.id;

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString();
  };

  const getChatLink = (conv) =>
    conv.type === 'direct' ? `/chat?id=${conv.chatRoomId}` : `/chat?swap=${conv._id}`;

  if (loading) {
    return (
      <div className="fade-in">
        <SkeletonChat />
      </div>
    );
  }

  return (
    <div className="chat-page fade-in">
      <div className="chat-layout">
        {/* Left sidebar - Chat list */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2><i className="fas fa-comments"></i> Chats</h2>
          </div>
          <div className="chat-list">
            {conversations.length === 0 ? (
              <div className="chat-list-empty">
                <i className="fas fa-comment-slash"></i>
                <p>No chats yet</p>
                <span>Start a swap to begin chatting</span>
              </div>
            ) : (
              conversations.map((conv) => (
                <Link
                  key={conv.chatRoomId || conv._id}
                  to={getChatLink(conv)}
                  className={`chat-list-item ${(activeId === conv._id || activeId === conv.chatRoomId) ? 'active' : ''}`}
                >
                  <div className="chat-list-avatar">
                    {conv.otherUser?.name?.charAt(0) || '?'}
                  </div>
                  <div className="chat-list-content">
                    <div className="chat-list-name">{conv.otherUser?.name || 'Swap partner'}</div>
                    <div className="chat-list-preview">
                      {conv.lastMessage
                        ? `${conv.lastMessage.senderName === user?.name ? 'You' : conv.lastMessage.senderName}: ${conv.lastMessage.body?.substring(0, 40)}${conv.lastMessage.body?.length > 40 ? '...' : ''}`
                        : conv.type === 'direct' ? (conv.requestedItem ? `Re: ${conv.requestedItem}` : 'Chat started') : `Swap: ${conv.requestedItem || ''}`}
                    </div>
                  </div>
                  <div className="chat-list-time">{formatTime(conv.lastMessage?.createdAt || conv.updatedAt)}</div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right panel - Active chat */}
        <div className="chat-main">
          {active ? (
            <>
              <div className="chat-header">
                <h3><i className="fas fa-user"></i> {active.otherUser?.name || 'Chat partner'}</h3>
                <div className="chat-header-actions">
                  {active.type === 'swap' && (
                    <Link to={`/swaps/${active._id}`} className="chat-view-swap">
                      <i className="fas fa-exchange-alt"></i> View swap
                    </Link>
                  )}
                  <button
                    onClick={handleDeleteContact}
                    className="chat-delete-contact"
                    title="Remove from chat list"
                  >
                    <i className="fas fa-trash-alt"></i> Remove
                  </button>
                </div>
              </div>
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-messages-empty">
                    <i className="fas fa-comment-dots"></i>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`chat-message ${isMyMessage(msg) ? 'mine' : 'theirs'}`}
                    >
                      <div className="chat-bubble">
                        <div className="chat-sender">{msg.senderId?.name || 'Unknown'}</div>
                        <div className="chat-body">{msg.body}</div>
                        <div className="chat-time">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input-area">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="btn btn-primary">
                  <i className="fas fa-paper-plane"></i> Send
                </button>
              </div>
            </>
          ) : (
            <div className="chat-welcome">
              <i className="fas fa-comments"></i>
              <h3>Select a chat</h3>
              <p>Choose a conversation, or chat with an item owner from their item page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
