
import React, { useState, useEffect, useRef } from 'react';
import ProjectItem from '@/components/ProjectItem';
import CustomCursor from '@/components/CustomCursor';
import FloatingContactButton from '@/components/FloatingContactButton';
import SearchBar from '@/components/SearchBar';
import { Link } from 'react-router-dom';

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
  const [headerCompact, setHeaderCompact] = useState(false);
  
  // Restore scroll position after navigation
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    
    if (savedScrollPosition && contentRef.current) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      setScrolled(window.scrollY > 50);
      setHeaderCompact(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-portfolio-white">
      <CustomCursor />
      
      {/* Header with dynamic transformation */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          headerCompact 
            ? 'py-3 bg-transparent backdrop-blur-sm' 
            : 'py-8 bg-portfolio-white'
        }`}
      >
        <div className={`mx-auto px-6 transition-all duration-500 ${
          headerCompact ? 'max-w-full' : 'max-w-5xl'
        }`}>
          <div className={`flex items-center transition-all duration-500 ${
            headerCompact 
              ? 'justify-start gap-6' 
              : 'justify-between'
          }`}>
            {/* Name and title section */}
            <div className={`transition-all duration-500 ${
              headerCompact ? 'flex items-center gap-4' : ''
            }`}>
              <h1 className={`font-display font-semibold tracking-wider transition-all duration-500 ${
                headerCompact 
                  ? 'text-lg text-portfolio-white mix-blend-difference' 
                  : 'text-xl md:text-2xl lg:text-3xl text-portfolio-charcoal'
              }`}>
                RAJENDRA DAMAR
              </h1>
              
              <div className={`text-sm md:text-base tracking-wider transition-all duration-500 ${
                headerCompact 
                  ? 'text-portfolio-white mix-blend-difference' 
                  : 'text-portfolio-charcoal mt-1'
              }`}>
                GRAPHIC DESIGNER
              </div>
            </div>
            
            {/* Search bar - only show when not compact */}
            <div className={`transition-all duration-500 ${
              headerCompact ? 'hidden' : 'block'
            }`}>
              <SearchBar projects={projects} />
            </div>
            
            {/* Contact link */}
            <Link 
              to="/contact" 
              className={`transition-all duration-500 ${
                headerCompact 
                  ? 'text-portfolio-white mix-blend-difference text-sm py-1 px-4 border border-white/20 rounded-full hover:bg-white/10' 
                  : 'text-portfolio-charcoal hover:text-portfolio-darkGray text-sm md:text-base tracking-wider'
              }`}
            >
              CONTACT
            </Link>
          </div>
        </div>
        
        {/* Enhanced purple flare elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-dark-orchid opacity-25 blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-dark-orchid opacity-20 blur-3xl -z-10"></div>
      </header>
      
      {/* Projects Gallery Section */}
      <main 
        ref={contentRef}
        className="w-full pt-32 pb-16"
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
      
      {scrolled && <FloatingContactButton />}
    </div>
  );
};

export default Index;
