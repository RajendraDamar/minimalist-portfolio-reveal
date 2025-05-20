
import React, { useEffect, useRef } from 'react';
import ProjectItem from '@/components/ProjectItem';
import CustomCursor from '@/components/CustomCursor';
import Header from '@/components/Header';
import { useProjects } from '@/hooks/useProjects';

const Index: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { projects, loading } = useProjects();
  
  // Restore scroll position after navigation
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-portfolio-charcoal">
      <CustomCursor />
      <Header projects={projects} />
      
      {/* Projects Gallery Section */}
      <main 
        ref={contentRef}
        className="w-full pt-24 pb-16"
      >
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="text-portfolio-white opacity-80">Loading projects...</div>
          </div>
        ) : (
          <div className="masonry-grid">
            {projects.map((project) => (
              <ProjectItem 
                key={project.id}
                id={project.id}
                title={project.title}
                thumbnail={project.thumbnail}
                type={project.type}
                likes={project.likes}
                aspectRatio={project.aspect_ratio || 'aspect-[4/3]'}
                background={project.id === '4' ? 'bg-portfolio-lightGray' : undefined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
