
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Search, Mail } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

interface HeaderProps {
  projects: Array<{
    id: string;
    title: string;
    thumbnail?: string;
  }>;
}

const Header: React.FC<HeaderProps> = ({ projects }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Handle search button click
  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'py-3' 
          : 'py-4'
      }`}
    >
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-portfolio-charcoal/90 to-transparent transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      >
      </div>
      
      <div className="container max-w-screen-xl mx-auto px-6">
        <div className="relative flex items-center justify-between">
          {/* Left: Title (normal) or Name+Title (scrolled) */}
          <div className={`transition-all duration-500 flex ${
            scrolled ? 'flex-col items-start' : 'items-center'
          }`}>
            {/* Name - Centered initially, moves to left when scrolled */}
            {scrolled && (
              <h1 
                className="order-1 font-unbounded font-semibold text-lg tracking-wider text-portfolio-white cursor-pointer transition-all duration-500"
                onClick={scrollToTop}
              >
                RAJENDRA DAMAR
              </h1>
            )}
            
            {/* Title - visible on left initially, under name when scrolled */}
            <div 
              className={`text-sm font-syne tracking-wider transition-all duration-500 ${
                scrolled 
                  ? 'order-2 text-xs text-portfolio-white/80 mt-0.5' 
                  : 'order-1 text-portfolio-white'
              }`}
              onClick={scrolled ? scrollToTop : undefined}
            >
              GRAPHIC DESIGNER
            </div>
          </div>
          
          {/* Middle: Name (normal state only) */}
          {!scrolled && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center transition-all duration-500">
              <h1 className="font-unbounded font-semibold text-xl md:text-2xl lg:text-3xl text-portfolio-white">
                RAJENDRA DAMAR
              </h1>
            </div>
          )}
          
          {/* Right: Search and Contact buttons */}
          <div className={`flex items-center gap-4 transition-all duration-500 ${
            scrolled ? 'justify-end' : ''
          }`}>
            {/* Search bar/button */}
            {scrolled ? (
              <div className="absolute left-1/2 transform -translate-x-1/2 w-60 transition-all duration-500">
                <div 
                  onClick={toggleSearchInput}
                  className={`transition-all duration-300 flex items-center justify-center rounded-full ${showSearchInput ? 'w-full bg-portfolio-lightGray/30' : 'w-10 bg-portfolio-lightGray/20'} h-10 hover:bg-portfolio-lightGray/30 cursor-pointer`}
                >
                  {showSearchInput ? (
                    <SearchBar projects={projects} expanded={true} closeSearch={() => setShowSearchInput(false)} />
                  ) : (
                    <Search size={20} className="text-portfolio-white" />
                  )}
                </div>
              </div>
            ) : (
              <button 
                onClick={toggleSearchInput} 
                className="bg-portfolio-lightGray/20 p-2 rounded-full hover:bg-portfolio-lightGray/30 transition-all duration-300"
                aria-label="Search"
              >
                <Search size={18} className="text-portfolio-white" />
              </button>
            )}
            
            {/* Contact button */}
            <Link 
              to="/contact" 
              className={`transition-all duration-500 flex items-center rounded-full ${
                scrolled 
                  ? 'bg-portfolio-lightGray/20 px-4 py-2 text-sm hover:bg-portfolio-lightGray/30' 
                  : 'bg-portfolio-lightGray/20 p-2 hover:bg-portfolio-lightGray/30'
              }`}
            >
              <Mail size={scrolled ? 18 : 18} className="text-portfolio-white" />
              {scrolled && <span className="ml-2 text-portfolio-white">CONTACT</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
