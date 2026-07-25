import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Code, Layout, Layers, Terminal, Server } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="about-page">
      <motion.section 
        className="about-hero"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h1>About PageLens</h1>
        <p className="about-hero-subtitle">
          A modern website intelligence platform built for developers who care about quality.
        </p>
      </motion.section>

      <motion.section 
        className="about-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="about-section-title">What is PageLens?</h2>
        <p className="about-text">
          PageLens is a comprehensive website analysis tool that provides deep insights into performance, SEO, accessibility, and security. We believe that great web experiences start with great data.
        </p>
        
        <div className="about-grid about-grid-3">
          <div className="about-feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3>Instant Analysis</h3>
            <p>Enter any URL and get comprehensive insights in seconds.</p>
          </div>
          
          <div className="about-feature-card">
            <div className="feature-icon-wrapper">
              <Activity size={24} />
            </div>
            <h3>Actionable Insights</h3>
            <p>Not just data, but clear recommendations to improve.</p>
          </div>
          
          <div className="about-feature-card">
            <div className="feature-icon-wrapper">
              <Code size={24} />
            </div>
            <h3>Developer First</h3>
            <p>Built by developers, for developers. Clean. Fast. Purposeful.</p>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="about-section-title">Built With</h2>
        <div className="about-grid about-grid-4">
          <div className="about-tech-card">
            <div className="tech-icon-wrapper">
              <Layout size={32} />
            </div>
            <h4>React</h4>
            <p>Frontend UI Library</p>
          </div>
          
          <div className="about-tech-card">
            <div className="tech-icon-wrapper">
              <Terminal size={32} />
            </div>
            <h4>Vite</h4>
            <p>Build Tool</p>
          </div>
          
          <div className="about-tech-card">
            <div className="tech-icon-wrapper">
              <Server size={32} />
            </div>
            <h4>Spring Boot</h4>
            <p>Backend Framework</p>
          </div>
          
          <div className="about-tech-card">
            <div className="tech-icon-wrapper">
              <Layers size={32} />
            </div>
            <h4>Lucide Icons</h4>
            <p>Icon System</p>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="about-section-title">Why PageLens?</h2>
        <p className="about-text">
          PageLens was built as a demonstration of modern web development practices — combining clean architecture, thoughtful design, and real utility into a product that could ship to production.
        </p>
        <p className="about-text">
          Every pixel, every interaction, every micro-animation was crafted with intention.
        </p>
      </motion.section>

      <motion.section 
        className="about-credits"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <p>Built for <a href="#" target="_blank" rel="noopener noreferrer">Digital Heroes Training Task</a></p>
        <p>Designed and developed with care.</p>
      </motion.section>
    </div>
  );
};

export default AboutPage;
