
import React from 'react';
import { Link } from 'react-router-dom';
import CustomCursor from '@/components/CustomCursor';
import { ArrowLeft } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-portfolio-charcoal overflow-hidden">
      <CustomCursor />
      
      <div className="py-16 lg:py-24 px-6 lg:px-0 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-white hover:text-portfolio-darkGray mb-16 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-x border-portfolio-lightGray/20 px-8">
          {/* Left column - Text content */}
          <div className="lg:col-span-5 lg:pr-12">
            <h1 className="text-4xl md:text-5xl font-unbounded font-normal text-portfolio-white mb-12 tracking-wide">RAJENDRA DAMAR</h1>
            
            <div className="space-y-8 text-portfolio-darkGray text-lg font-syne font-light">
              <p className="text-portfolio-gray">
                I'm a graphic designer based in Jakarta, Indonesia, passionate about visual storytelling and creating meaningful design experiences. My approach combines minimalism with impactful communication to deliver memorable visual solutions.
              </p>
              
              <p className="text-portfolio-gray">
                With over 7 years of experience, I've worked with a diverse range of clients across branding, print design, UI/UX, and digital media.
              </p>

              <div className="pt-8 border-t border-portfolio-lightGray/20">
                <h3 className="text-xl font-normal font-unbounded text-portfolio-white tracking-wide mb-4 mt-8">CONTACT</h3>
                <p className="mb-2 font-light text-portfolio-gray">hello@rajendradamar.com</p>
                <p className="mb-8 font-light text-portfolio-gray">+62 812 3456 7890</p>
                
                <div className="flex space-x-8">
                  <a href="https://instagram.com" className="text-portfolio-white hover:text-portfolio-darkGray transition-colors font-syne" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://linkedin.com" className="text-portfolio-white hover:text-portfolio-darkGray transition-colors font-syne" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://behance.net" className="text-portfolio-white hover:text-portfolio-darkGray transition-colors font-syne" target="_blank" rel="noopener noreferrer">Behance</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="lg:col-span-7 h-[400px] md:h-[600px] lg:h-[80vh]">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
              alt="Rajendra Damar" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
