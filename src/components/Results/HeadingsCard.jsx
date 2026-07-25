import React from 'react';
import { Heading, Check, AlertCircle } from 'lucide-react';
import ResultCard from './ResultCard';

const HeadingsCard = ({ 
  headings = { h1: 1, h2: 4, h3: 7, h4: 2 },
  h1Text = "Main Page Title Heading"
}) => {
  const { h1, h2, h3, h4 } = headings;
  const maxCount = Math.max(h1, h2, h3, h4, 1);
  
  let variant = 'warning';
  let badgeText = 'Multiple H1s';
  
  if (h1 === 1) {
    variant = 'success';
    badgeText = 'Perfect H1';
  } else if (h1 === 0) {
    variant = 'danger';
    badgeText = 'Missing H1';
  }

  const renderBar = (label, count) => (
    <div className="mini-bar-row" key={label}>
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div 
          className="mini-bar-fill" 
          style={{ 
            width: `${(count / maxCount) * 100}%`,
            background: label === 'H1' ? `var(--${variant})` : 'var(--accent-secondary)'
          }}
        />
      </div>
      <span className="mini-bar-value">{count}</span>
    </div>
  );

  return (
    <ResultCard
      icon={Heading}
      iconVariant={variant}
      title="Headings Structure"
      detail="Distribution of heading tags (H1-H4)"
    >
      <div className="flex-between mt-16 mb-8">
        <div className={`result-badge result-badge--${variant}`}>
          {variant === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {badgeText}
        </div>
      </div>

      {h1Text && h1 === 1 && (
        <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 500, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>H1</span>
          "{h1Text}"
        </div>
      )}

      <div className="mini-bar-chart">
        {renderBar('H1', h1)}
        {renderBar('H2', h2)}
        {renderBar('H3', h3)}
        {renderBar('H4', h4)}
      </div>
    </ResultCard>
  );
};

export default HeadingsCard;
