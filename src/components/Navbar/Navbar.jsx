import React, { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { GitFork, ArrowRight, Menu, X } from 'lucide-react';
import Logo from '../../assets/Logo';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Logo />
        </Link>

        <nav className={`navbar-nav ${mobileMenuOpen ? 'navbar-nav--open' : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/analyze" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Analyze
          </NavLink>
          <NavLink 
            to="/history" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            History
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <a href="#" className="navbar-icon-btn" aria-label="GitHub">
            <GitFork size={20} />
          </a>
          
          <Link to="/analyze" className="navbar-cta">
            Analyze Website
            <ArrowRight size={16} />
          </Link>

          <button 
            className="navbar-icon-btn navbar-mobile-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
