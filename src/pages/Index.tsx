
import React, { useEffect, useRef, useState } from 'react';
import ProjectItem from '@/components/ProjectItem';
import CustomCursor from '@/components/CustomCursor';
import Header from '@/components/Header';
import { useProjects } from '@/hooks/useProjects';

const Index: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { projects, loading } = useProjects();
  const [visibleProjects, setVisibleProjects] = useState<typeof projects>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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
  
  // Setup intersection observer for lazy loading projects
  useEffect(() => {
    if (loading) return;
    
    // Initially load the first batch of projects
    setVisibleProjects(projects.slice(0, 12));
    
    // Setup intersection observer for infinite scroll effect
    const options = {
      root: null,
      rootMargin: '200px', // Load before user reaches the end
      threshold: 0.1,
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // When the sentinel is visible, load more projects
        setVisibleProjects(prev => {
          if (prev.length >= projects.length) return prev;
          return [...projects.slice(0, Math.min(prev.length + 8, projects.length))];
        });
      }
    };
    
    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersect, options);
    
    // After initial render, find and observe the sentinel
    const sentinel = document.getElementById('projects-sentinel');
    if (sentinel) observerRef.current.observe(sentinel);
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [projects, loading]);

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
          <>
            <div className="masonry-grid">
              {visibleProjects.map((project) => (
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
            
            {/* Sentinel element for intersection observer */}
            <div 
              id="projects-sentinel" 
              className="h-20 w-full"
              aria-hidden="true"
            ></div>
            
            {/* Show loading indicator if not all projects are loaded yet */}
            {visibleProjects.length < projects.length && (
              <div className="flex justify-center items-center py-8">
                <div className="w-6 h-6 border-2 border-portfolio-darkGray border-t-portfolio-white rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
