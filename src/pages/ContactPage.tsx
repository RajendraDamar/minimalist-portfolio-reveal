
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/CustomCursor';
import { ArrowLeft } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-portfolio-white">
      <CustomCursor />
      
      <div className="container mx-auto px-6 py-16 md:py-24">
        <Link to="/" className="inline-flex items-center text-portfolio-charcoal hover:text-portfolio-darkGray mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-portfolio-charcoal">Get in Touch</h1>
            <p className="text-lg text-portfolio-darkGray">I'm available for freelance work, collaborations, or just a friendly chat about design and development.</p>
            
            <div className="space-y-4 mt-8">
              <div>
                <h3 className="text-xl font-serif font-medium text-portfolio-charcoal">Email</h3>
                <p className="text-portfolio-darkGray">hello@example.com</p>
              </div>
              
              <div>
                <h3 className="text-xl font-serif font-medium text-portfolio-charcoal">Location</h3>
                <p className="text-portfolio-darkGray">New York City, USA</p>
              </div>
              
              <div>
                <h3 className="text-xl font-serif font-medium text-portfolio-charcoal">Social</h3>
                <div className="flex space-x-4 mt-2">
                  <a href="https://instagram.com" className="text-portfolio-charcoal hover:text-portfolio-darkGray transition-colors" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://linkedin.com" className="text-portfolio-charcoal hover:text-portfolio-darkGray transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://behance.net" className="text-portfolio-charcoal hover:text-portfolio-darkGray transition-colors" target="_blank" rel="noopener noreferrer">Behance</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Designer Portrait" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
