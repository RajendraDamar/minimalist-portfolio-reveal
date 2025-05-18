
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <>
      <div 
        onClick={() => setShowPreview(true)}
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
      
      {/* Quick preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-portfolio-charcoal border-portfolio-lightGray sm:max-w-md">
          <div className="flex items-start gap-4 p-2">
            <div className="w-1/3">
              {type === 'image' ? (
                <img 
                  src={thumbnail} 
                  alt={title} 
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <video 
                  src={thumbnail} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full aspect-square object-cover"
                />
              )}
            </div>
            <div className="w-2/3">
              <h3 className="text-xl font-unbounded font-medium text-portfolio-white mb-3">{title}</h3>
              <Link 
                to={`/project/${id}`} 
                className="text-sm text-portfolio-gray hover:text-portfolio-white transition-colors font-syne"
              >
                View Project
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectItem;
