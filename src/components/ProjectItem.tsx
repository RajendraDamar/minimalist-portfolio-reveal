
import React, { useState } from 'react';
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
    
    // Create a sharing function similar to davidmilan.com
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
    
    // Create popup menu
    const menu = document.createElement('div');
    menu.className = 'fixed z-50 bg-portfolio-lightGray/90 backdrop-blur-md rounded-md shadow-lg py-2 text-portfolio-white animate-fade-in';
    menu.style.minWidth = '180px';
    
    // Determine position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    menu.style.top = `${rect.bottom + 10}px`;
    menu.style.right = `20px`;
    
    // Add menu items
    shareOptions.forEach(option => {
      const item = document.createElement('div');
      item.className = 'px-4 py-2 hover:bg-portfolio-gray/30 cursor-pointer transition-colors';
      item.textContent = option.name;
      item.onclick = () => {
        option.action();
        document.body.removeChild(menu);
      };
      menu.appendChild(item);
    });
    
    // Close when clicking outside
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menu.contains(event.target as Node)) {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
        document.removeEventListener('click', handleOutsideClick);
      }
    };
    
    // Add to DOM
    document.body.appendChild(menu);
    
    // Add click listener with small delay to avoid immediate closure
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 100);
  };
  
  // Helper for clipboard
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
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
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
          className={`like-button absolute bottom-3 left-3 bg-portfolio-charcoal/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${liked ? 'text-red-500' : 'text-portfolio-white'} flex items-center`}
          aria-label="Like"
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {likes > 0 && <span className="ml-1 text-xs">{likes}</span>}
        </button>

        {/* Share button */}
        <button 
          onClick={handleShare} 
          className="share-button absolute bottom-3 right-3 bg-portfolio-charcoal/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-portfolio-white"
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProjectItem;
