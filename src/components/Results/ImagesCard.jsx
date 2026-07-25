import React from 'react';
import { Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import ResultCard from './ResultCard';

const ImagesCard = ({ images = { total: 24, missingAlt: 2, withAlt: 22 } }) => {
  const { total, missingAlt, withAlt } = images;
  
  const missingPercentage = total > 0 ? (missingAlt / total) * 100 : 0;
  
  let variant = 'success';
  let badgeText = 'Accessible';
  
  if (missingAlt > 0) {
    if (missingPercentage < 30) {
      variant = 'warning';
      badgeText = 'Needs Work';
    } else {
      variant = 'danger';
      badgeText = 'Poor';
    }
  }

  if (total === 0) {
    variant = 'neutral';
    badgeText = 'No Images';
  }

  return (
    <ResultCard
      icon={ImageIcon}
      iconVariant={variant}
      title="Image Accessibility"
      detail="Images missing alt text attributes"
    >
      <div className="flex-between mt-16">
        <div>
          <h4 className={`result-card-value ${missingAlt > 0 ? variant : 'success'}`} style={{ margin: 0 }}>
            {missingAlt > 0 ? missingAlt : total}
          </h4>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {missingAlt > 0 ? 'Missing alt text' : 'Images found'}
          </span>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div className={`result-badge result-badge--${variant} mb-8`}>
            {variant === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            {badgeText}
          </div>
          {total > 0 && (
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
              {withAlt} / {total} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>with alt</span>
            </div>
          )}
        </div>
      </div>
      
      {missingAlt > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Search engines use alt attributes to understand image content. Screen readers rely on them for visually impaired users.
        </div>
      )}
    </ResultCard>
  );
};

export default ImagesCard;
