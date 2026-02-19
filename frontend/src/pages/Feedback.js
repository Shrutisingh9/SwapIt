import React, { useState } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import axios from 'axios';
import './Feedback.css';

function Feedback() {
  const [formData, setFormData] = useState({
    type: 'general',
    subject: '',
    message: '',
    rating: 5
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
      setFormData({ type: 'general', subject: '', message: '', rating: 5 });
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="profile-layout">
        <ProfileSidebar />
        <div className="feedback-container">
          <div className="feedback-content">
            <div className="feedback-success">
              <i className="fas fa-check-circle"></i>
              <h2>Thank You!</h2>
              <p>Your feedback has been submitted successfully. We appreciate your input!</p>
              <button onClick={() => setSubmitted(false)} className="btn btn-primary">
                Submit Another Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="feedback-container">
        <div className="feedback-content">
          <h1 className="feedback-title">
            <i className="fas fa-comment-dots"></i> Share Your Feedback
          </h1>
          <p className="feedback-subtitle">We'd love to hear from you! Your feedback helps us improve SwapIt.</p>

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label>
                <i className="fas fa-tag"></i> Feedback Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-star"></i> Overall Rating
              </label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, rating: star })}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-heading"></i> Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your feedback"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-align-left"></i> Your Feedback
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you think... What do you like? What can we improve?"
                rows={8}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="loading"></span> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="feedback-info">
            <h3><i className="fas fa-info-circle"></i> What happens next?</h3>
            <ul>
              <li>Your feedback is reviewed by our team</li>
              <li>We use your input to improve SwapIt</li>
              <li>For bug reports, we'll work on fixes</li>
              <li>Feature requests are considered for future updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
