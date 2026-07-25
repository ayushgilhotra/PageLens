import React from 'react';
import { motion } from 'framer-motion';
import './Results.css';

const ResultCard = ({ 
  icon: Icon, 
  iconVariant = 'accent', 
  title, 
  value, 
  detail, 
  children,
  className = ''
}) => {
  return (
    <motion.div 
      className={`result-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="result-card-header">
        {Icon && (
          <div className={`result-card-icon result-card-icon--${iconVariant}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <h3 className="result-card-title">{title}</h3>
      </div>
      
      <div className="result-card-content">
        {value && <h4 className="result-card-value">{value}</h4>}
        {detail && <p className="result-card-detail">{detail}</p>}
        {children}
      </div>
    </motion.div>
  );
};

export default ResultCard;
