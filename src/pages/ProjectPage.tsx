
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';
import FloatingContactButton from '@/components/FloatingContactButton';

// Placeholder project data - Replace with your actual projects
const projectsData = {
  '1': {
    title: 'Digital Artwork',
    description: 'This project explores the intersection of digital art and traditional media techniques. Through a series of experiments with digital brushes and textures, I created a collection that blurs the boundaries between physical and digital artwork.',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    details: 'Created using Procreate and Adobe Photoshop. The process involved multiple iterations and explorations of color theory and composition.',
    year: '2023'
  },
  '2': {
    title: 'Tech Solutions',
    description: 'A comprehensive design system for a technology company that needed to unify their digital products. This project involved creating a cohesive visual language and component library that could scale across multiple platforms.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    details: 'Designed using Figma with a focus on accessibility and consistent user experience across web and mobile applications.',
    year: '2022'
  },
  '3': {
    title: 'Nature Exploration',
    description: 'A photography series documenting the hidden landscapes of national parks. This project was an exploration of natural light and composition in varied environmental conditions.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    details: 'Shot on Sony A7III with minimal post-processing to preserve the authentic colors and textures of the natural world.',
    year: '2023'
  },
  '4': {
    title: 'Coding Project',
    description: 'An interactive web application that visualizes complex data in an intuitive and engaging way. This project combines front-end development with data visualization techniques to make information more accessible.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    details: 'Built using React, D3.js, and TypeScript. The design focuses on meaningful interactions that help users understand complex datasets.',
    year: '2021'
  },
  '5': {
    title: 'Cat Photography',
    description: 'An intimate portrait series exploring the personality and character of feline companions. This project captures the unique expressions and behaviors of cats in their natural environments.',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    details: 'Shot in natural light settings with minimal equipment to create authentic, unposed portraits.',
    year: '2022'
  },
  '6': {
    title: 'Interior Design',
    description: 'A complete renovation and design project for a mid-century modern home. This project balanced preserving historical elements while updating the space for contemporary living.',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    details: 'Completed in collaboration with local craftsmen using sustainable materials and techniques.',
    year: '2023'
  }
};

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? projectsData[id as keyof typeof projectsData] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project not found</p>
        <Link to="/">Return to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-portfolio-white">
      <CustomCursor />
      <FloatingContactButton />
      
      <div className="container mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center text-portfolio-charcoal hover:text-portfolio-darkGray mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        
        <div className="w-full h-[60vh] relative mb-12">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-portfolio-charcoal mb-4">{project.title}</h1>
          <p className="text-portfolio-darkGray mb-8">{project.year}</p>
          
          <p className="text-lg text-portfolio-charcoal mb-8">{project.description}</p>
          
          <div className="border-t border-portfolio-lightGray pt-8 mt-8">
            <h2 className="text-2xl font-serif font-medium text-portfolio-charcoal mb-4">Project Details</h2>
            <p className="text-portfolio-darkGray">{project.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
