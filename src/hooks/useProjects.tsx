
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();
      
      if (error) throw error;
      await fetchProjects();
      return data?.[0];
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      await fetchProjects();
    } catch (err) {
      console.error('Error updating project:', err);
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
    } catch (err) {
      console.error('Error deleting project:', err);
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
      await fetchProjects();
    } catch (err) {
      console.error('Error incrementing likes:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
