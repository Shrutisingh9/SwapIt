import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // In a real app, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-success">
            <i className="fas fa-check-circle"></i>
            <h2>Message Sent!</h2>
            <p>Thank you for contacting us. We'll get back to you soon.</p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary">
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">
          <i className="fas fa-envelope"></i> Contact Us
        </h1>
        <p className="contact-subtitle">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <i className="fas fa-envelope"></i>
              <h3>Email</h3>
              <p>support@swapit.com</p>
            </div>
            <div className="info-card">
              <i className="fas fa-phone"></i>
              <h3>Phone</h3>
              <p>+91-1800-XXX-XXXX</p>
            </div>
            <div className="info-card">
              <i className="fas fa-clock"></i>
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9 AM - 6 PM IST</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>
                <i className="fas fa-user"></i> Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-heading"></i> Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What is this regarding?"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-comment"></i> Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us how we can help..."
                rows={6}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="loading"></span> Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
