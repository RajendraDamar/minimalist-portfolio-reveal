
import React from 'react';
import { Link } from 'react-router-dom';

const FloatingContactButton: React.FC = () => {
  return (
    <Link to="/contact" className="floating-button">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-dark-orchid/60 to-dark-orchid/30 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-all duration-500"></div>
        <button 
          className="relative rounded-full bg-portfolio-charcoal text-portfolio-white px-6 py-3 text-sm tracking-wide border-none shadow-md transform transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 animate-float"
        >
          Contact Me
        </button>
      </div>
    </Link>
  );
};

export default FloatingContactButton;
