
import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectItemProps {
  id: string;
  title: string;
  thumbnail: string;
  type: 'image' | 'video';
  aspectRatio?: string;
  background?: string;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  title,
  thumbnail,
  type,
  aspectRatio = 'aspect-video',
  background = 'bg-portfolio-white'
}) => {
  return (
    <Link 
      to={`/project/${id}`} 
      className="project-item block mb-0 break-inside-avoid"
      style={{ display: 'block' }}
    >
      <div className={`relative ${aspectRatio} ${background} overflow-hidden`}>
        {type === 'image' ? (
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <video 
            src={thumbnail} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <div className="project-item-overlay">
          <h3 className="project-item-title">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ProjectItem;
