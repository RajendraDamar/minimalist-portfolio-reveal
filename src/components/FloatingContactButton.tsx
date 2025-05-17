
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FloatingContactButton: React.FC = () => {
  return (
    <Link to="/contact" className="floating-button">
      <Button 
        className="rounded-full bg-portfolio-charcoal text-portfolio-white hover:bg-portfolio-darkGray"
      >
        Contact Me
      </Button>
    </Link>
  );
};

export default FloatingContactButton;
