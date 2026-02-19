import React from 'react';
import './Terms.css';

function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Terms of Service</h1>
        <div className="legal-content">
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using SwapIt, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily use SwapIt for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on SwapIt</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </section>

          <section>
            <h2>4. Item Listings</h2>
            <p>When listing items on SwapIt, you agree to:</p>
            <ul>
              <li>Provide accurate descriptions and images</li>
              <li>List items that you legally own and have the right to swap or donate</li>
              <li>Not list prohibited items (weapons, illegal substances, etc.)</li>
              <li>Respond promptly to swap requests</li>
            </ul>
          </section>

          <section>
            <h2>5. Swaps and Transactions</h2>
            <p>SwapIt facilitates connections between users but is not a party to any swap agreement. Users are responsible for:</p>
            <ul>
              <li>Verifying item conditions before swapping</li>
              <li>Arranging safe meeting locations</li>
              <li>Completing swaps in a timely manner</li>
              <li>Resolving disputes directly with other users</li>
            </ul>
          </section>

          <section>
            <h2>6. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use SwapIt for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Spam or send unsolicited messages</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>SwapIt shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.</p>
          </section>

          <section>
            <h2>8. Modifications</h2>
            <p>SwapIt reserves the right to modify these terms at any time. Your continued use of the platform constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2>9. Contact Information</h2>
            <p>If you have questions about these Terms of Service, please contact us at <a href="/contact">support@swapit.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
