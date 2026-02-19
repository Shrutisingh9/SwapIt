import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Privacy Policy</h1>
        <div className="legal-content">
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Profile information (bio, location, gender, date of birth)</li>
              <li>Item listings and descriptions</li>
              <li>Messages and communications with other users</li>
              <li>Swap requests and transaction history</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and facilitate swaps</li>
              <li>Send you notifications and updates</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information:</p>
            <ul>
              <li>With other users as necessary to facilitate swaps (e.g., your name and contact info)</li>
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze usage, and assist with marketing efforts.</p>
          </section>

          <section>
            <h2>7. Children's Privacy</h2>
            <p>SwapIt is not intended for users under the age of 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="/contact">support@swapit.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
