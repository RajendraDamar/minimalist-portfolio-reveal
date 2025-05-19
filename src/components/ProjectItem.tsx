
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share } from 'lucide-react';

interface ProjectItemProps {
  id: string;
  title: string;
  thumbnail: string;
  type: 'image' | 'video';
  likes?: number;
  aspectRatio?: string;
  background?: string;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  title,
  thumbnail,
  type,
  likes = 0,
  aspectRatio = 'aspect-video',
  background = 'bg-portfolio-charcoal'
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const handleClick = () => {
    navigate(`/project/${id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    // Here we would connect to Supabase to update likes
    console.log('Like clicked for project:', id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.origin + `/project/${id}`
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      const url = window.location.origin + `/project/${id}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className="project-item block mb-0 break-inside-avoid cursor-none"
      style={{ display: 'block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${aspectRatio} ${background} overflow-hidden group`}>
        {type === 'image' ? (
          <img 
            src={thumbnail} 
            alt={title} 
            className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? 'grayscale' : ''}`}
          />
        ) : (
          <video 
            src={thumbnail} 
            autoPlay 
            muted 
            loop 
            playsInline
            className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? 'grayscale' : ''}`}
          />
        )}
        <div className="project-item-overlay">
          <h3 className="project-item-title font-unbounded">{title}</h3>
        </div>

        {/* Like button */}
        <button 
          onClick={handleLike} 
          className={`absolute bottom-3 left-3 bg-portfolio-charcoal/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${liked ? 'text-red-500' : 'text-portfolio-white'} flex items-center`}
          aria-label="Like"
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {likes > 0 && <span className="ml-1 text-xs">{likes}</span>}
        </button>

        {/* Share button */}
        <button 
          onClick={handleShare} 
          className="absolute bottom-3 right-3 bg-portfolio-charcoal/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-portfolio-white"
          aria-label="Share"
        >
          <Share size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;
