
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Mail, Search } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Project } from '@/hooks/useProjects';

interface HeaderProps {
  projects: Project[];
}

const Header: React.FC<HeaderProps> = ({ projects }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
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
        className="absolute inset-0 header-vignette transition-opacity duration-500"
      >
      </div>
      
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="relative flex items-center justify-between">
          {/* Left: Title (normal) or Name+Title (scrolled) */}
          <div className={`transition-all duration-500 flex ${
            scrolled || isMobile ? 'flex-col items-start' : 'items-center'
          }`}>
            {/* Name - Shown on mobile always, or when scrolled on desktop */}
            {(scrolled || isMobile) && (
              <h1 
                className="order-1 font-unbounded font-semibold text-lg tracking-wider text-portfolio-white cursor-pointer transition-all duration-500 hover:text-portfolio-white/80"
                onClick={scrollToTop}
              >
                RAJENDRA DAMAR
              </h1>
            )}
            
            {/* Title - visible on left initially, under name when scrolled */}
            <div 
              className={`font-syne tracking-wider transition-all duration-500 ${
                scrolled || isMobile
                  ? 'order-2 text-xs text-portfolio-white/80 mt-0.5' 
                  : 'order-1 text-sm text-portfolio-white'
              }`}
              onClick={(scrolled || isMobile) ? scrollToTop : undefined}
            >
              GRAPHIC DESIGNER
            </div>
          </div>
          
          {/* Middle: Name (normal state only on desktop) */}
          {!scrolled && !isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center transition-all duration-500 hidden sm:block">
              <h1 
                className="font-unbounded font-semibold text-xl md:text-2xl lg:text-3xl text-portfolio-white hover:text-portfolio-white/80 transition-all cursor-pointer"
                onClick={scrollToTop}
              >
                RAJENDRA DAMAR
              </h1>
            </div>
          )}
          
          {/* Right: Search and Contact buttons - Adjusted for mobile */}
          <div className="flex items-center gap-2 sm:gap-4 transition-all duration-500">
            {/* Search bar/button */}
            {!isMobile && (
              scrolled ? (
                <div className="flex items-center">
                  <div className="w-52 transition-all duration-300 mr-2">
                    <SearchBar 
                      projects={projects} 
                      expanded={true} 
                      initialIsActive={true}
                    />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={toggleSearchInput} 
                  className="bg-portfolio-lightGray/20 p-2 rounded-full hover:bg-portfolio-lightGray/40 transition-all duration-300 text-sm flex items-center justify-center transform hover:scale-105"
                  aria-label="Search"
                >
                  {showSearchInput ? (
                    <div className="w-48">
                      <SearchBar 
                        projects={projects} 
                        expanded={false}
                        closeSearch={() => setShowSearchInput(false)} 
                        initialIsActive={true}
                      />
                    </div>
                  ) : (
                    <Search className="text-portfolio-white" size={16} />
                  )}
                </button>
              )
            )}
            
            {/* Contact button with enhanced hover */}
            <Link 
              to="/contact" 
              className={`transition-all duration-300 flex items-center rounded-full transform hover:scale-105 ${
                scrolled || isMobile
                  ? 'bg-portfolio-lightGray/20 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-portfolio-lightGray/40' 
                  : 'bg-portfolio-lightGray/20 px-4 py-2 hover:bg-portfolio-lightGray/40'
              }`}
            >
              <Mail size={scrolled || isMobile ? 16 : 18} className="text-portfolio-white" />
              {(scrolled || isMobile) && <span className="ml-2 text-portfolio-white hidden sm:inline">CONTACT</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
