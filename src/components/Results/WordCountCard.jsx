import React, { useEffect, useState } from 'react';
import { Type, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ResultCard from './ResultCard';

const WordCountCard = ({ count = 850 }) => {
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5s
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayCount(Math.floor(easeOut * count));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [count]);

  const readTime = Math.ceil(count / 200);
  
  // Rough categorization for content density
  let densityVariant = 'warning';
  let densityLabel = 'Thin Content';
  let width = 25;
  
  if (count > 300) {
    densityVariant = 'success';
    densityLabel = 'Good Length';
    width = Math.min(100, (count / 1500) * 100);
  } else if (count > 1500) {
    densityVariant = 'accent';
    densityLabel = 'Comprehensive';
    width = 100;
  }

  return (
    <ResultCard
      icon={Type}
      iconVariant="accent"
      title="Word Count"
      detail={`Estimated reading time based on 200 words per minute`}
    >
      <div className="flex-between mt-16 mb-8">
        <h4 className="result-card-value" style={{ margin: 0 }}>
          {displayCount.toLocaleString()}
        </h4>
        <div className="result-badge result-badge--neutral">
          <Clock size={14} />
          {readTime} min read
        </div>
      </div>
      
      <div className="progress-bar-bg" style={{ marginBottom: '8px' }}>
        <motion.div 
          className={`progress-bar-fill ${densityVariant}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'right' }}>
        {densityLabel}
      </div>
    </ResultCard>
  );
};

export default WordCountCard;
