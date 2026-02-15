import React from 'react';
import './Skeleton.css';

export function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card card">
      <div className="skeleton-card-image">
        <Skeleton className="skeleton-block" />
      </div>
      <div className="skeleton-card-body">
        <Skeleton className="skeleton-line short" />
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-line long" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item" style={{ animationDelay: `${i * 0.08}s` }}>
          <Skeleton className="skeleton-avatar" />
          <div className="skeleton-list-content">
            <Skeleton className="skeleton-line" />
            <Skeleton className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonSwapCard() {
  return (
    <div className="skeleton-swap-card card">
      <div className="skeleton-swap-header">
        <Skeleton className="skeleton-line" style={{ width: 160, height: 24 }} />
        <Skeleton className="skeleton-line" style={{ width: 80, height: 20 }} />
      </div>
      <div className="skeleton-swap-grid">
        <div className="skeleton-swap-block">
          <Skeleton className="skeleton-line short" />
          <Skeleton className="skeleton-line" style={{ width: '80%', height: 20 }} />
        </div>
        <div className="skeleton-swap-block">
          <Skeleton className="skeleton-line short" />
          <Skeleton className="skeleton-line" style={{ width: '80%', height: 20 }} />
        </div>
      </div>
      <div className="skeleton-swap-actions">
        <Skeleton className="skeleton-btn" />
        <Skeleton className="skeleton-btn" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="skeleton-detail card">
      <div className="skeleton-detail-grid">
        <Skeleton className="skeleton-detail-image" />
        <div className="skeleton-detail-content">
          <Skeleton className="skeleton-line" style={{ width: '70%', height: 32 }} />
          <Skeleton className="skeleton-line" style={{ width: '100%', height: 60 }} />
          <div className="skeleton-detail-meta">
            <Skeleton className="skeleton-line" style={{ width: 100, height: 24 }} />
            <Skeleton className="skeleton-line" style={{ width: 100, height: 24 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="skeleton-chat-page fade-in">
      <div className="skeleton-chat-sidebar">
        <Skeleton className="skeleton-line" style={{ width: 120, height: 28 }} />
        <SkeletonList count={5} />
      </div>
      <div className="skeleton-chat-main">
        <Skeleton className="skeleton-line" style={{ width: 150, height: 24 }} />
        <div className="skeleton-chat-messages">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="skeleton-chat-bubble" style={{ alignSelf: i % 2 ? 'flex-end' : 'flex-start' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonItemGrid({ count = 12 }) {
  return (
    <div className="olx-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
