import React from 'react';
import { Layout } from 'lucide-react';
import ResultCard from './ResultCard';

const PageTitleCard = ({ 
  title = "Welcome to Example Domain", 
  url = "https://example.com" 
}) => {
  const length = title.length;
  let variant = 'warning';
  let qualityText = 'Too Short';
  
  if (length >= 30 && length <= 60) {
    variant = 'success';
    qualityText = 'Good Length';
  } else if (length > 60) {
    variant = 'danger';
    qualityText = 'Too Long';
  }

  const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;

  return (
    <ResultCard
      icon={Layout}
      iconVariant={variant}
      title="Page Title"
      detail="The HTML title tag for this page"
    >
      <div className="browser-mockup mt-16">
        <div className="browser-header">
          <div className="browser-dots">
            <div className="browser-dot red"></div>
            <div className="browser-dot yellow"></div>
            <div className="browser-dot green"></div>
          </div>
          <div className="browser-tab">
            <img src={faviconUrl} alt="" style={{ width: 14, height: 14 }} />
            <span className="browser-tab-title">{title}</span>
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {title}
          </h4>
          <div className="flex-between">
            <span className={`result-badge result-badge--${variant}`}>
              {length}/60 chars
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {qualityText}
            </span>
          </div>
        </div>
      </div>
    </ResultCard>
  );
};

export default PageTitleCard;
