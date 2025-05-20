
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, ExternalLink } from 'lucide-react';
import CustomCursor from '@/components/CustomCursor';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/hooks/useProjects';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const shareUrl = window.location.href;

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
          setProject({
            ...data,
            type: (data.type === 'image' || data.type === 'video') ? data.type : 'image'
          } as Project);
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
    setShareDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Project link copied to clipboard!"
    });
  };

  const shareOptions = [
    { 
      name: "Copy Link", 
      action: copyToClipboard,
      icon: <ExternalLink className="h-4 w-4 mr-2" />
    },
    { 
      name: "Facebook", 
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'),
      icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" /></svg>
    },
    { 
      name: "Twitter", 
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(project?.title || '')}`, '_blank'),
      icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.89c-.74.33-1.53.55-2.35.65.85-.5 1.5-1.3 1.8-2.24-.8.47-1.68.8-2.6.98C18.12 4.5 17.07 4 15.9 4c-2.25 0-4.07 1.8-4.07 4 0 .32.04.62.1.92-3.4-.17-6.4-1.78-8.4-4.22-.35.6-.55 1.3-.55 2.03 0 1.4.72 2.62 1.8 3.34-.66-.02-1.3-.2-1.84-.5v.05c0 1.94 1.4 3.56 3.26 3.93-.34.1-.7.14-1.07.14-.26 0-.52-.02-.77-.07.52 1.6 2 2.76 3.77 2.8-1.38 1.07-3.13 1.7-5.02 1.7-.33 0-.65-.02-.97-.06 1.8 1.13 3.93 1.8 6.2 1.8 7.46 0 11.54-6.15 11.54-11.5 0-.17 0-.35-.02-.52.8-.57 1.48-1.28 2.03-2.1z" /></svg>
    },
    { 
      name: "LinkedIn", 
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank'),
      icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" /></svg>
    },
    { 
      name: "WhatsApp", 
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(project?.title + ' ' + shareUrl)}`, '_blank'),
      icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    },
    { 
      name: "Email", 
      action: () => window.open(`mailto:?subject=${encodeURIComponent(project?.title || '')}&body=${encodeURIComponent(shareUrl)}`, '_blank'),
      icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" /><path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" /></svg>
    }
  ];

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

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-portfolio-lightGray border-portfolio-gray text-portfolio-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-portfolio-white">Share this project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <input 
                className="flex-1 px-3 py-2 bg-portfolio-charcoal text-portfolio-white border border-portfolio-gray rounded focus:outline-none"
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button 
                onClick={copyToClipboard}
                className="bg-portfolio-gray hover:bg-portfolio-gray/80 text-white"
              >
                Copy
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {shareOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    option.action();
                    if (option.name !== 'Copy Link') {
                      setShareDialogOpen(false);
                    }
                  }}
                  className="flex items-center justify-start border-portfolio-gray text-portfolio-white hover:bg-portfolio-gray/20"
                >
                  {option.icon}
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectPage;
