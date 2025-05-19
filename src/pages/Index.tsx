import React, { useEffect, useRef } from 'react';
import ProjectItem from '@/components/ProjectItem';
import CustomCursor from '@/components/CustomCursor';
import Header from '@/components/Header';

// Expanded project data with more examples
const projects = [
  {
    id: '1',
    title: 'Digital Artwork',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    type: 'image' as const,
    likes: 15,
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: '2',
    title: 'Tech Solutions',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    type: 'image' as const,
    likes: 8,
    aspectRatio: 'aspect-[1/1]'
  },
  {
    id: '3',
    title: 'Nature Exploration',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    type: 'image' as const,
    likes: 24,
    aspectRatio: 'aspect-[16/9]'
  },
  {
    id: '4',
    title: 'Coding Project',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    type: 'image' as const,
    likes: 5,
    aspectRatio: 'aspect-[4/5]'
  },
  {
    id: '5',
    title: 'Cat Photography',
    thumbnail: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    type: 'image' as const,
    likes: 19,
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: '6',
    title: 'Interior Design',
    thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    type: 'image' as const,
    likes: 12,
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: '7',
    title: 'Urban Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    type: 'image' as const,
    likes: 18,
    aspectRatio: 'aspect-[3/2]'
  },
  {
    id: '8',
    title: 'Product Design',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    type: 'image' as const,
    likes: 10,
    aspectRatio: 'aspect-[1/1]'
  },
  {
    id: '9',
    title: 'Fashion Editorial',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    type: 'image' as const,
    likes: 14,
    aspectRatio: 'aspect-[2/3]'
  },
  {
    id: '10',
    title: 'Brand Identity',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8659b8e76b1e',
    type: 'image' as const,
    likes: 16,
    aspectRatio: 'aspect-[4/3]'
  },
  {
    id: '11',
    title: 'Modern Typography',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    type: 'image' as const,
    likes: 11,
    aspectRatio: 'aspect-[16/9]'
  },
  {
    id: '12',
    title: 'Editorial Design',
    thumbnail: 'https://images.unsplash.com/photo-1544568100-847a948585b9',
    type: 'image' as const,
    likes: 13,
    aspectRatio: 'aspect-[1/1]'
  },
  {
    id: '13',
    title: 'Abstract Art',
    thumbnail: 'https://images.unsplash.com/photo-1552084117-56a987666449',
    type: 'image' as const,
    likes: 17,
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: '14',
    title: 'Minimalist Posters',
    thumbnail: 'https://images.unsplash.com/photo-1545178803-771a97c5eabd',
    type: 'image' as const,
    likes: 15,
    aspectRatio: 'aspect-[2/3]'
  },
  {
    id: '15',
    title: 'Colorful Illustrations',
    thumbnail: 'https://images.unsplash.com/photo-1501366062246-723b4d3e4eb6',
    type: 'image' as const,
    likes: 18,
    aspectRatio: 'aspect-[4/3]'
  }
];

const Index: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
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
        <div className="masonry-grid">
          {projects.map((project) => (
            <ProjectItem 
              key={project.id}
              id={project.id}
              title={project.title}
              thumbnail={project.thumbnail}
              type={project.type}
              likes={project.likes}
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
