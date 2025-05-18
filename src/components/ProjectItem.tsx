
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  background = 'bg-portfolio-charcoal'
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/project/${id}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="project-item block mb-0 break-inside-avoid cursor-pointer"
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
          <h3 className="project-item-title font-unbounded">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
