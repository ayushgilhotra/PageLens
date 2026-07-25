import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import ResultCard from './ResultCard';

const MetaDescriptionCard = ({ 
  title = "Example Website - Home", 
  description = "This is an example meta description. It provides a brief summary of a web page and helps users decide whether to click on the search result.", 
  url = "https://example.com" 
}) => {
  const hasDescription = description && description.trim().length > 0;
  const length = hasDescription ? description.length : 0;
  
  let variant = 'warning';
  if (length >= 120 && length <= 160) variant = 'success';
  else if (length === 0) variant = 'danger';

  const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <ResultCard
      icon={FileText}
      iconVariant={variant}
      title="Meta Description"
      className="serp-card"
      style={{ gridColumn: 'span 2' }}
    >
      <div className="flex-between mt-16 mb-16">
        <div className={`result-badge result-badge--${variant}`}>
          {length}/160 chars
        </div>
        {!hasDescription && (
          <div className="result-badge result-badge--danger">
            <AlertCircle size={14} />
            Missing Description
          </div>
        )}
      </div>

      {hasDescription ? (
        <div className="serp-preview" style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px' }}>
          <div className="serp-url-wrap">
            <img src={faviconUrl} alt="" className="serp-favicon" />
            <span className="serp-url">{url}</span>
          </div>
          <h4 className="serp-title">{title}</h4>
          <p className="serp-desc">{description}</p>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <AlertCircle size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '14px' }}>No meta description found on this page.</p>
        </div>
      )}
    </ResultCard>
  );
};

export default MetaDescriptionCard;
