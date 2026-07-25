import React from 'react';
import { ExternalLink, Lock, Unlock } from 'lucide-react';
import ResultCard from './ResultCard';

const WebsitePreviewCard = ({ 
  url = "https://example.com"
}) => {
  const isSecure = url.startsWith('https');
  const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <ResultCard
      icon={ExternalLink}
      iconVariant="neutral"
      title="Target Website"
      detail="Information about the analyzed URL"
    >
      <div className="flex-col" style={{ alignItems: 'center', textAlign: 'center', margin: '24px 0' }}>
        <img 
          src={faviconUrl} 
          alt={`${domain} favicon`} 
          style={{ width: 48, height: 48, borderRadius: '12px', marginBottom: '16px', background: 'var(--bg-primary)', padding: '4px' }} 
        />
        <h4 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0', wordBreak: 'break-all' }}>
          {domain}
        </h4>
        <div className={`result-badge result-badge--${isSecure ? 'success' : 'warning'}`}>
          {isSecure ? <Lock size={14} /> : <Unlock size={14} />}
          {isSecure ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-outline" 
          style={{ width: '100%' }}
        >
          Open Website <ExternalLink size={16} />
        </a>
      </div>
    </ResultCard>
  );
};

export default WebsitePreviewCard;
