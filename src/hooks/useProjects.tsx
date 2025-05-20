
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: 'image' | 'video';
  likes: number;
  aspect_ratio: string;
  created_at?: string;
  updated_at?: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the data to ensure it matches the Project type interface
      const typedProjects = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        thumbnail: item.thumbnail || '',
        // Ensure type is either 'image' or 'video', default to 'image' if invalid
        type: (item.type === 'image' || item.type === 'video') ? item.type as 'image' | 'video' : 'image',
        likes: item.likes || 0,
        aspect_ratio: item.aspect_ratio || 'aspect-[4/3]',
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setProjects(typedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>, file?: File) => {
    try {
      // If there's a file, upload it to storage first
      let thumbnailUrl = project.thumbnail;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);
          
        thumbnailUrl = publicUrl;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          thumbnail: thumbnailUrl
        }])
        .select();
      
      if (error) throw error;
      
      await fetchProjects();
      sonnerToast.success("Project created", {
        description: "Your project has been successfully created."
      });
      
      return data?.[0];
    } catch (err) {
      console.error('Error adding project:', err);
      sonnerToast.error("Error", {
        description: "Failed to create project. Please try again."
      });
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>, file?: File) => {
    try {
      let updatedData = { ...updates };
      
      // If there's a file, upload it to storage first
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `thumbnails/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);
          
        updatedData.thumbnail = publicUrl;
      }
      
      const { error } = await supabase
        .from('projects')
        .update(updatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProjects();
      sonnerToast.success("Project updated", {
        description: "Your project has been successfully updated."
      });
    } catch (err) {
      console.error('Error updating project:', err);
      sonnerToast.error("Error", {
        description: "Failed to update project. Please try again."
      });
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProjects();
      sonnerToast.success("Project deleted", {
        description: "Your project has been successfully deleted."
      });
    } catch (err) {
      console.error('Error deleting project:', err);
      sonnerToast.error("Error", {
        description: "Failed to delete project. Please try again."
      });
      throw err;
    }
  };

  const incrementLikes = async (id: string) => {
    try {
      // First get the current likes count
      const { data: projectData, error: fetchError } = await supabase
        .from('projects')
        .select('likes')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Then update with the incremented value
      const { error: updateError } = await supabase
        .from('projects')
        .update({ likes: (projectData?.likes || 0) + 1 })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Update local state for immediate UI feedback
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? { ...project, likes: (project.likes || 0) + 1 } 
            : project
        )
      );
      
      sonnerToast.success("Thank you!", {
        description: "You liked this project."
      });
    } catch (err) {
      console.error('Error incrementing likes:', err);
      sonnerToast.error("Error", {
        description: "Failed to like project. Please try again."
      });
      throw err;
    }
  };

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { 
    projects, 
    loading, 
    error, 
    fetchProjects, 
    addProject, 
    updateProject, 
    deleteProject,
    incrementLikes
  };
};
