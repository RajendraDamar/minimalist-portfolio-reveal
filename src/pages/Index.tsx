import React, { useEffect, useRef, useState } from 'react';
import Slideshow from '@/components/Slideshow';
import ProjectItem from '@/components/ProjectItem';
import FloatingContactButton from '@/components/FloatingContactButton';
import CustomCursor from '@/components/CustomCursor';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Placeholder data - Replace with your actual projects
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
  }
];

// Placeholder slideshow images
const slideshowImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22'
];

const Index: React.FC = () => {
  const scrollPosition = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showContactButton, setShowContactButton] = useState(false);
  const landingRef = useRef<HTMLElement>(null);

  // Restore scroll position after navigation
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition && contentRef.current) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 100);
    }

    const handleScroll = () => {
      scrollPosition.current = window.scrollY;
      sessionStorage.setItem('scrollPosition', scrollPosition.current.toString());
      
      // Show contact button only after scrolling past the landing section
      if (landingRef.current) {
        const landingHeight = landingRef.current.offsetHeight;
        setShowContactButton(window.scrollY > landingHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProjects = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CustomCursor />
      {showContactButton && <FloatingContactButton />}

      {/* Landing Section with Slideshow - Full viewport height and width */}
      <section 
        ref={landingRef}
        className="relative h-screen w-screen flex items-center justify-center"
      >
        <Slideshow images={slideshowImages} />
        <div className="relative z-10 text-center text-portfolio-white p-6 animate-slide-down">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wider">RAJENDRA DAMAR</h1>
          <p className="text-xl sm:text-2xl font-light tracking-widest">GRAPHIC DESIGNER</p>
        </div>
        
        {/* Scroll down arrow */}
        <Button
          onClick={scrollToProjects}
          variant="ghost"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-portfolio-white hover:bg-transparent hover:text-portfolio-gray animate-bounce z-10 rounded-full p-2 border border-portfolio-white"
        >
          <ArrowDown className="h-6 w-6" />
          <span className="sr-only">Scroll Down</span>
        </Button>
      </section>

      {/* Projects Gallery Section - No padding to make it seamless */}
      <section 
        ref={contentRef}
        className="bg-portfolio-white w-full"
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
      </section>
    </div>
  );
};

export default Index;
