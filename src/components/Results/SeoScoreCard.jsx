import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import ResultCard from './ResultCard';

const SeoScoreCard = ({ 
  score = 85, 
  grade = 'B+', 
  breakdown = [
    { label: 'Technical SEO', passed: true },
    { label: 'Content', passed: true },
    { label: 'Meta Tags', passed: false },
    { label: 'Performance', passed: true }
  ] 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(easeOut * score));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  let variant = 'danger';
  if (score >= 80) variant = 'success';
  else if (score >= 60) variant = 'warning';

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <ResultCard
      icon={Award}
      iconVariant={variant}
      title="Overall SEO Score"
      style={{ gridRow: 'span 2' }}
    >
      <div className="seo-score-container">
        <svg className="seo-score-svg" viewBox="0 0 120 120">
          <circle 
            className="seo-score-track" 
            cx="60" cy="60" r={radius} 
          />
          <circle 
            className={`seo-score-fill ${variant}`} 
            cx="60" cy="60" r={radius} 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="seo-score-text">
          <span className="seo-score-number">{animatedScore}</span>
          <span className="seo-score-grade">{grade}</span>
        </div>
      </div>

      <div className="flex-col gap-8 mt-16">
        {breakdown.map((item, i) => (
          <div key={i} className="flex-between" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.passed ? 
                <CheckCircle2 size={14} color="var(--success)" /> : 
                <AlertCircle size={14} color="var(--danger)" />
              }
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </ResultCard>
  );
};

export default SeoScoreCard;
