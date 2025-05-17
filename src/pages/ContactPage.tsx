
import React from 'react';
import { Link } from 'react-router-dom';
import CustomCursor from '@/components/CustomCursor';
import { ArrowLeft } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-portfolio-white overflow-hidden">
      <CustomCursor />
      
      <div className="py-16 lg:py-24 px-6 lg:px-0 max-w-screen-xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-charcoal hover:text-portfolio-darkGray mb-16 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Work
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left column - Text content */}
          <div className="lg:col-span-5 lg:pr-20">
            <h1 className="text-4xl md:text-5xl font-serif font-normal text-portfolio-charcoal mb-12 tracking-wide">RAJENDRA DAMAR</h1>
            
            <div className="space-y-8 text-portfolio-darkGray text-lg font-light">
              <p>
                I'm a graphic designer based in Jakarta, Indonesia, passionate about visual storytelling and creating meaningful design experiences. My approach combines minimalism with impactful communication to deliver memorable visual solutions.
              </p>
              
              <p>
                With over 7 years of experience, I've worked with a diverse range of clients across branding, print design, UI/UX, and digital media.
              </p>

              <div className="pt-8">
                <h3 className="text-xl font-normal text-portfolio-charcoal tracking-wide mb-4">CONTACT</h3>
                <p className="mb-2 font-light">hello@rajendradamar.com</p>
                <p className="mb-8 font-light">+62 812 3456 7890</p>
                
                <div className="flex space-x-6">
                  <a href="https://instagram.com" className="text-portfolio-charcoal hover:text-portfolio-darkGray transition-colors" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://linkedin.com" className="text-portfolio-charcoal hover:text-portfolio-darkGray transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://behance.net" className="text-portfolio-charcoal hover:text-portfolio-darkGray transition-colors" target="_blank" rel="noopener noreferrer">Behance</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="lg:col-span-7 h-[400px] md:h-[600px] lg:h-[80vh]">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Rajendra Damar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
