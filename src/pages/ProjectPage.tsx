
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share } from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/hooks/useProjects';
import { useToast } from "@/components/ui/use-toast";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setProject(data as Project);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, navigate, toast]);

  const handleLike = async () => {
    if (!project) return;
    
    try {
      setLiked(!liked);
      
      if (!liked) {
        // Increment likes locally first for better UX
        setProject({
          ...project,
          likes: project.likes + 1
        });
        
        // Update in database
        const { error } = await supabase
          .from('projects')
          .update({ likes: project.likes + 1 })
          .eq('id', project.id);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      // Revert the local change if the update fails
      setLiked(!liked);
      setProject({
        ...project,
        likes: project.likes - (liked ? 0 : 1)
      });
      
      toast({
        title: "Error",
        description: "Failed to update likes",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    try {
      // Check if Web Share API is available
      if (navigator.share) {
        navigator.share({
          title: project?.title || 'Project',
          url: window.location.href
        })
        .catch((error) => console.log('Error sharing:', error));
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Project link copied to clipboard!"
        });
      }
    } catch (error) {
      console.error('Error sharing project:', error);
      toast({
        title: "Error",
        description: "Failed to share project",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portfolio-charcoal">
        <p className="text-portfolio-white">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portfolio-charcoal">
        <p className="text-portfolio-white">Project not found</p>
        <Link to="/" className="ml-2 text-portfolio-gray hover:text-portfolio-white">Return to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-portfolio-charcoal overflow-hidden">
      <CustomCursor />
      
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="border-x border-portfolio-lightGray/10 px-4 md:px-8">
          <Link to="/" className="inline-flex items-center text-portfolio-white hover:text-portfolio-darkGray mb-12 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Left column - Image */}
            <div className="w-full h-[400px] md:h-[600px] lg:h-[80vh] relative">
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Like & Share buttons */}
              <div className="absolute bottom-4 left-4 flex space-x-3">
                <button 
                  onClick={handleLike} 
                  className={`like-button flex items-center space-x-2 bg-portfolio-charcoal/70 px-3 py-2 rounded-full ${liked ? 'text-red-500' : 'text-portfolio-white'}`}
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                  <span className="text-sm">{project.likes}</span>
                </button>
                
                <button 
                  onClick={handleShare} 
                  className="share-button flex items-center space-x-2 bg-portfolio-charcoal/70 px-3 py-2 rounded-full text-portfolio-white"
                >
                  <Share size={18} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
            
            {/* Right column - Project details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-portfolio-white mb-4 tracking-wide">{project.title.toUpperCase()}</h1>
              <p className="text-portfolio-darkGray mb-8">{new Date(project.created_at || '').getFullYear()}</p>
              
              <p className="text-lg text-portfolio-darkGray mb-8">{project.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
