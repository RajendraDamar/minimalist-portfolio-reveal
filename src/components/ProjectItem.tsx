
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);
  
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
    setShowShareMenu(!showShareMenu);
  };
  
  // Handle image/video loaded state
  const handleMediaLoaded = () => {
    setIsLoaded(true);
  };
  
  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current && 
        !shareMenuRef.current.contains(event.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    const handleScroll = () => {
      if (showShareMenu) {
        setShowShareMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showShareMenu]);

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-portfolio-gray/90 text-portfolio-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in';
    toast.textContent = 'Link copied to clipboard!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.replace('animate-fade-in', 'animate-fade-out');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  };
  
  // Share options
  const shareUrl = window.location.origin + `/project/${id}`;
  const shareTitle = title;
  const shareOptions = [
    { name: 'Copy Link', action: () => copyToClipboard(shareUrl) },
    { name: 'Facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank') },
    { name: 'Twitter', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank') },
    { name: 'LinkedIn', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank') },
    { name: 'WhatsApp', action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank') },
    { name: 'Email', action: () => window.open(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`, '_blank') }
  ];
  
  return (
    <div 
      onClick={handleClick}
      className="project-item block mb-0 break-inside-avoid cursor-none"
      style={{ display: 'block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowShareMenu(false);
      }}
    >
      <div className={`relative ${aspectRatio} ${background} overflow-hidden group`}>
        {type === 'image' ? (
          <img 
            src={thumbnail} 
            alt={title} 
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleMediaLoaded}
            loading="lazy"
          />
        ) : (
          <video 
            src={thumbnail} 
            autoPlay 
            muted 
            loop 
            playsInline
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadedData={handleMediaLoaded}
          />
        )}
        
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-portfolio-charcoal">
            <div className="w-6 h-6 border-2 border-portfolio-darkGray border-t-portfolio-white rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Enhanced overlay with title that shows on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <h3 className="text-xl md:text-2xl font-unbounded text-white text-center px-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">{title}</h3>
        </div>

        {/* Fixed positioning for buttons to ensure they're always visible */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Like button with count shown inline */}
          <button 
            onClick={handleLike} 
            className="like-button bg-portfolio-charcoal/70 hover:bg-portfolio-charcoal/90 p-2 rounded-full text-portfolio-white flex items-center transform hover:scale-110 transition-all"
            aria-label="Like"
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            {likes > 0 && <span className="like-count text-xs ml-1">{likes}</span>}
          </button>

          {/* Share button */}
          <button 
            ref={shareButtonRef}
            onClick={handleShare} 
            className="share-button bg-portfolio-charcoal/70 hover:bg-portfolio-charcoal/90 p-2 rounded-full text-portfolio-white transform hover:scale-110 transition-all"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
        
        {/* Share dropdown menu - positioned relative to the button */}
        {showShareMenu && (
          <div 
            ref={shareMenuRef}
            className="share-dropdown absolute bottom-14 right-3 bg-portfolio-gray/90 backdrop-blur-sm rounded-md shadow-lg overflow-hidden z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {shareOptions.map((option, index) => (
              <div 
                key={index} 
                className="px-4 py-2 hover:bg-portfolio-gray/70 text-portfolio-white text-sm cursor-pointer transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  option.action();
                  setShowShareMenu(false);
                }}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
