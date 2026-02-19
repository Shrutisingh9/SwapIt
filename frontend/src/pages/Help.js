import React from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import './Help.css';

function Help() {
  return (
    <div className="profile-layout">
      <ProfileSidebar />
      <div className="help-container">
        <div className="help-content">
          <h1 className="help-title">
            <i className="fas fa-question-circle"></i> Help Center
          </h1>

          <div className="help-section">
            <h2><i className="fas fa-info-circle"></i> Getting Started</h2>
            <div className="help-item">
              <h3>How do I create an account?</h3>
              <p>Click on the "Login" button in the navbar, then select "Register" to create a new account. You'll need to provide your name, email, and create a password.</p>
            </div>
            <div className="help-item">
              <h3>How do I add an item?</h3>
              <p>Click on the "+ ADD ITEM" button in the navbar. Fill in the item details including title, description, category, condition, and upload photos. You can choose to swap or donate the item.</p>
            </div>
            <div className="help-item">
              <h3>How do I swap items?</h3>
              <p>Browse items on the Feed or Explore page. When you find an item you like, click on it to view details. If you want to swap, select one of your items to offer and send a swap request.</p>
            </div>
          </div>

          <div className="help-section">
            <h2><i className="fas fa-exchange-alt"></i> Swapping</h2>
            <div className="help-item">
              <h3>How do swap requests work?</h3>
              <p>When you request a swap, the item owner will receive a notification. They can accept, reject, or counter-offer. Once accepted, you can chat with the other party to arrange the exchange.</p>
            </div>
            <div className="help-item">
              <h3>What happens after a swap is accepted?</h3>
              <p>After acceptance, you'll be able to chat with the other user to arrange meeting details, exchange locations, and finalize the swap. Mark the swap as completed once you've exchanged items.</p>
            </div>
            <div className="help-item">
              <h3>Can I cancel a swap?</h3>
              <p>Yes, you can cancel a pending swap request before it's accepted. Once accepted, you should communicate with the other party if you need to cancel.</p>
            </div>
          </div>

          <div className="help-section">
            <h2><i className="fas fa-comments"></i> Chat & Communication</h2>
            <div className="help-item">
              <h3>How do I chat with other users?</h3>
              <p>Chats are automatically created when you request a swap or when someone requests a swap with you. You can also start a direct chat from an item's detail page by clicking "Chat".</p>
            </div>
            <div className="help-item">
              <h3>Can I chat about multiple items with the same user?</h3>
              <p>Yes! All your conversations with a user are grouped together. You can discuss multiple items in the same chat thread.</p>
            </div>
          </div>

          <div className="help-section">
            <h2><i className="fas fa-shield-alt"></i> Safety & Security</h2>
            <div className="help-item">
              <h3>How do I report a problem?</h3>
              <p>If you encounter any issues with a user or item, use the "Report" option in the chat menu or item detail page. Our team will review your report and take appropriate action.</p>
            </div>
            <div className="help-item">
              <h3>What should I do if someone is being inappropriate?</h3>
              <p>You can block the user using the three-dot menu in the chat. You can also report them for our team to review. Always meet in public places for exchanges.</p>
            </div>
          </div>

          <div className="help-section">
            <h2><i className="fas fa-heart"></i> Donations</h2>
            <div className="help-item">
              <h3>How do I donate an item?</h3>
              <p>When creating an item, select "Donate" instead of "Swap". You can also choose to donate to a specific NGO. The item will be marked as a donation and won't require a swap.</p>
            </div>
            <div className="help-item">
              <h3>Can I donate to NGOs?</h3>
              <p>Yes! When creating a donation item, you can select an NGO partner. Your donation will go directly to that organization.</p>
            </div>
          </div>

          <div className="help-contact">
            <h2><i className="fas fa-envelope"></i> Still Need Help?</h2>
            <p>If you can't find the answer you're looking for, please contact our support team:</p>
            <div className="contact-info">
              <p><i className="fas fa-envelope"></i> Email: support@swapit.com</p>
              <p><i className="fas fa-phone"></i> Phone: +91-1800-XXX-XXXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
