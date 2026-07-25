import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, FileSearch, Gauge, Search, Shield } from 'lucide-react';
import UrlInput from '../../components/UrlInput/UrlInput';
import './HomePage.css';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (url.trim()) {
      navigate(`/analyze?url=${encodeURIComponent(url.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    {
      icon: <FileSearch size={24} />,
      title: 'Metadata Analysis',
      description: 'Extract and validate page titles, descriptions, Open Graph tags, and structured data.'
    },
    {
      icon: <Gauge size={24} />,
      title: 'Performance Metrics',
      description: 'Measure response times, page load indicators, and server health status.'
    },
    {
      icon: <Search size={24} />,
      title: 'SEO Intelligence',
      description: 'Evaluate heading structure, keyword density, image optimization, and search readiness.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Accessibility Audit',
      description: 'Identify missing alt texts, ARIA issues, and accessibility improvement areas.'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-bg-shape shape-1"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="hero-bg-shape shape-2"
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="hero-bg-shape shape-3"
          animate={{ x: [0, 30, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="hero-badge-dot"></span>
            Website Intelligence Platform
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="hero-headline">
            Website Intelligence,<br />
            Designed for Developers.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-subheading">
            Analyze your website's structure, metadata, accessibility and performance in one elegant dashboard.
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-input-wrapper">
            <UrlInput 
              value={url}
              onChange={setUrl}
              onSubmit={handleAnalyze}
              size="large"
              placeholder="https://example.com"
              autoFocus
            />
          </motion.div>
          
          <motion.button 
            variants={itemVariants}
            className="hero-cta"
            onClick={handleAnalyze}
            whileHover={{ y: -2 }}
          >
            Analyze Website
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Everything you need to know</h2>
          <p className="features-subtitle">Comprehensive analysis in seconds</p>
        </div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-section">
        <p className="trusted-text">Trusted by developers worldwide</p>
        <div className="trusted-logos">
          <svg width="40" height="40" viewBox="0 0 40 40" className="trusted-logo"><circle cx="20" cy="20" r="16" fill="currentColor"/></svg>
          <svg width="40" height="40" viewBox="0 0 40 40" className="trusted-logo"><rect x="4" y="4" width="32" height="32" rx="6" fill="currentColor"/></svg>
          <svg width="40" height="40" viewBox="0 0 40 40" className="trusted-logo"><polygon points="20,4 36,32 4,32" fill="currentColor"/></svg>
          <svg width="40" height="40" viewBox="0 0 40 40" className="trusted-logo"><polygon points="20,4 36,12 36,28 20,36 4,28 4,12" fill="currentColor"/></svg>
          <svg width="40" height="40" viewBox="0 0 40 40" className="trusted-logo"><rect x="8" y="8" width="24" height="24" rx="12" fill="currentColor"/></svg>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
