import React from 'react';
import './Guidelines.css';

function Guidelines() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Community Guidelines</h1>
        <div className="legal-content">
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>Our Community Values</h2>
            <p>SwapIt is built on trust, respect, and mutual benefit. We expect all members to follow these guidelines to create a safe and positive environment for everyone.</p>
          </section>

          <section>
            <h2>1. Be Respectful</h2>
            <p>Treat all members with kindness and respect. This includes:</p>
            <ul>
              <li>Using polite language in all communications</li>
              <li>Respecting others' opinions and choices</li>
              <li>Not engaging in harassment, bullying, or discrimination</li>
              <li>Being patient and understanding during negotiations</li>
            </ul>
          </section>

          <section>
            <h2>2. Honest Listings</h2>
            <p>When listing items, be truthful and accurate:</p>
            <ul>
              <li>Provide clear, accurate descriptions</li>
              <li>Upload real photos showing the actual condition</li>
              <li>Disclose any defects or issues</li>
              <li>Set fair expectations for item condition</li>
            </ul>
          </section>

          <section>
            <h2>3. Safe Exchanges</h2>
            <p>Prioritize safety in all interactions:</p>
            <ul>
              <li>Meet in public, well-lit locations</li>
              <li>Bring a friend if possible</li>
              <li>Inspect items before completing swaps</li>
              <li>Trust your instincts - if something feels wrong, don't proceed</li>
            </ul>
          </section>

          <section>
            <h2>4. Prohibited Items</h2>
            <p>Do not list or swap:</p>
            <ul>
              <li>Weapons, firearms, or ammunition</li>
              <li>Illegal substances or drugs</li>
              <li>Stolen goods</li>
              <li>Counterfeit or pirated items</li>
              <li>Items that violate intellectual property rights</li>
              <li>Hazardous materials</li>
            </ul>
          </section>

          <section>
            <h2>5. Communication Standards</h2>
            <p>Maintain professional communication:</p>
            <ul>
              <li>Respond to messages in a timely manner</li>
              <li>Be clear and specific in your messages</li>
              <li>Keep conversations relevant to swapping</li>
              <li>No spam, unsolicited messages, or advertising</li>
            </ul>
          </section>

          <section>
            <h2>6. Swap Etiquette</h2>
            <p>Follow these best practices:</p>
            <ul>
              <li>Only request swaps for items you genuinely want</li>
              <li>Respond to swap requests promptly</li>
              <li>Honor accepted swaps and complete them as agreed</li>
              <li>Communicate clearly about meeting times and locations</li>
              <li>If you need to cancel, notify the other party as soon as possible</li>
            </ul>
          </section>

          <section>
            <h2>7. Reporting Issues</h2>
            <p>If you encounter problems:</p>
            <ul>
              <li>Report suspicious behavior or violations</li>
              <li>Use the report feature for inappropriate content</li>
              <li>Contact support for unresolved disputes</li>
              <li>Help us maintain a safe community</li>
            </ul>
          </section>

          <section>
            <h2>8. Consequences of Violations</h2>
            <p>Violations of these guidelines may result in:</p>
            <ul>
              <li>Warning notifications</li>
              <li>Temporary account suspension</li>
              <li>Permanent account ban</li>
              <li>Legal action if applicable</li>
            </ul>
          </section>

          <section>
            <h2>9. Questions?</h2>
            <p>If you have questions about these guidelines, please <a href="/contact">contact us</a> or visit our <a href="/help">Help Center</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Guidelines;
