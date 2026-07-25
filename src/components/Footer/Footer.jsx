import React from 'react';
import { GitFork, ExternalLink } from 'lucide-react';
import Logo from '../../assets/Logo';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Logo />
          <p className="footer-tagline">Analyze Smarter. Build Better.</p>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-bottom">
          <div className="footer-credit">
            &copy; {currentYear} PageLens. Made with Java, React and Spring Boot.
          </div>
          <div className="footer-credit">
            Built for <a href="#">Digital Heroes</a> Training Task
          </div>
          <div className="footer-social">
            <a href="#" className="footer-icon-btn" aria-label="GitHub">
              <GitFork size={18} />
            </a>
            <a href="#" className="footer-icon-btn" aria-label="Twitter">
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
