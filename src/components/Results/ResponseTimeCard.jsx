import React from 'react';
import { Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import ResultCard from './ResultCard';

const ResponseTimeCard = ({ time = 450 }) => {
  const getSpeedInfo = (ms) => {
    if (ms < 300) return { label: 'Excellent', variant: 'success', width: Math.max(10, (ms/1500)*100) };
    if (ms < 800) return { label: 'Good', variant: 'success', width: (ms/1500)*100 };
    if (ms < 1500) return { label: 'Average', variant: 'warning', width: (ms/1500)*100 };
    return { label: 'Slow', variant: 'danger', width: Math.min(100, (ms/1500)*100) };
  };

  const { label, variant, width } = getSpeedInfo(time);

  return (
    <ResultCard
      icon={Zap}
      iconVariant={variant}
      title="Response Time"
      detail="Time to first byte (TTFB) response"
    >
      <div className="flex-between mt-16 mb-8">
        <h4 className="result-card-value" style={{ margin: 0 }}>
          {time}
          <span style={{ fontSize: '18px', color: 'var(--text-secondary)', marginLeft: '4px' }}>ms</span>
        </h4>
        <div className={`result-badge result-badge--${variant}`}>
          <Activity size={14} />
          {label}
        </div>
      </div>
      
      <div className="progress-bar-bg">
        <motion.div 
          className={`progress-bar-fill ${variant}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </ResultCard>
  );
};

export default ResponseTimeCard;
