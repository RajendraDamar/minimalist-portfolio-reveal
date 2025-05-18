
import React, { useState, useEffect, useRef } from 'react';
import ProjectItem from '@/components/ProjectItem';
import CustomCursor from '@/components/CustomCursor';
import SearchBar from '@/components/SearchBar';
import { Link } from 'react-router-dom';
import { Search, Mail } from 'lucide-react';

// Expanded project data with more examples
const projects = [
  {
    id: '1',
    title: 'Digital Artwork',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    type: 'image' as const,
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: '2',
    title: 'Tech Solutions',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    type: 'image' as const,
    aspectRatio: 'aspect-[1/1]'
  },
  {
    id: '3',
    title: 'Nature Exploration',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    type: 'image' as const,
    aspectRatio: 'aspect-[16/9]'
  },
  {
    id: '4',
    title: 'Coding Project',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    type: 'image' as const,
    aspectRatio: 'aspect-[4/5]'
  },
  {
    id: '5',
    title: 'Cat Photography',
    thumbnail: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    type: 'image' as const,
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: '6',
    title: 'Interior Design',
    thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    type: 'image' as const,
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: '7',
    title: 'Urban Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    type: 'image' as const,
    aspectRatio: 'aspect-[3/2]'
  },
  {
    id: '8',
    title: 'Product Design',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    type: 'image' as const,
    aspectRatio: 'aspect-[1/1]'
  },
  {
    id: '9',
    title: 'Fashion Editorial',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    type: 'image' as const,
    aspectRatio: 'aspect-[2/3]'
  },
  {
    id: '10',
    title: 'Brand Identity',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8659b8e76b1e',
    type: 'image' as const,
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: '11',
    title: 'Modern Typography',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    type: 'image' as const,
    aspectRatio: 'aspect-[16/9]'
  },
  {
    id: '12',
    title: 'Editorial Design',
    thumbnail: 'https://images.unsplash.com/photo-1544568100-847a948585b9',
    type: 'image' as const,
    aspectRatio: 'aspect-[1/1]'
  },
  {
    id: '13',
    title: 'Abstract Art',
    thumbnail: 'https://images.unsplash.com/photo-1552084117-56a987666449',
    type: 'image' as const,
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: '14',
    title: 'Minimalist Posters',
    thumbnail: 'https://images.unsplash.com/photo-1545178803-771a97c5eabd',
    type: 'image' as const,
    aspectRatio: 'aspect-[2/3]'
  },
  {
    id: '15',
    title: 'Colorful Illustrations',
    thumbnail: 'https://images.unsplash.com/photo-1501366062246-723b4d3e4eb6',
    type: 'image' as const,
    aspectRatio: 'aspect-[4/3]'
  }
];

const Index: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  
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
  
  // Restore scroll position after navigation and handle scroll events
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    
    if (savedScrollPosition && contentRef.current) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 100);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      sessionStorage.setItem('scrollPosition', scrollY.toString());
      setScrolled(scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-portfolio-charcoal">
      <CustomCursor />
      
      {/* Header with two clear states: normal and scrolled */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrolled 
            ? 'py-3' 
            : 'py-4'
        }`}
      >
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-portfolio-charcoal/80 to-transparent" style={{ backdropFilter: 'blur(8px)' }}></div>
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
              <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                <h1 className="font-unbounded font-semibold text-xl md:text-2xl lg:text-3xl text-portfolio-white transition-all">
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
                <div className="w-60 transition-all duration-500 absolute left-1/2 transform -translate-x-1/2">
                  <SearchBar projects={projects} expanded={true} />
                </div>
              ) : (
                showSearchInput ? (
                  <div className="w-48 transition-all duration-300">
                    <SearchBar projects={projects} />
                  </div>
                ) : (
                  <button 
                    onClick={toggleSearchInput} 
                    className="bg-portfolio-lightGray/10 p-2 rounded-full hover:bg-portfolio-lightGray/20 transition-all duration-300"
                    aria-label="Search"
                  >
                    <Search size={18} className="text-portfolio-white" />
                  </button>
                )
              )}
              
              {/* Contact button */}
              <Link 
                to="/contact" 
                className={`transition-all duration-500 flex items-center rounded-full ${
                  scrolled 
                    ? 'bg-portfolio-lightGray/20 px-4 py-2 text-sm' 
                    : 'bg-portfolio-lightGray/10 p-2'
                }`}
              >
                <Mail size={scrolled ? 18 : 18} className="text-portfolio-white" />
                {scrolled && <span className="ml-2 text-portfolio-white">CONTACT</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Projects Gallery Section */}
      <main 
        ref={contentRef}
        className="w-full pt-24 pb-16"
      >
        <div className="masonry-grid">
          {projects.map((project) => (
            <ProjectItem 
              key={project.id}
              id={project.id}
              title={project.title}
              thumbnail={project.thumbnail}
              type={project.type}
              aspectRatio={project.aspectRatio}
              background={project.id === '4' ? 'bg-portfolio-lightGray' : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
