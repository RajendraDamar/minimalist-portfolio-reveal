
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import CustomCursor from '@/components/CustomCursor';

// Mock projects (will be replaced with Supabase data)
const initialProjects = [
  {
    id: '1',
    title: 'Digital Artwork',
    description: 'This project explores the intersection of digital art and traditional media techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    type: 'image',
    likes: 15
  },
  {
    id: '2',
    title: 'Tech Solutions',
    description: 'A comprehensive design system for a technology company that needed to unify their digital products.',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    type: 'image',
    likes: 8
  }
];

// Form schemas
interface ProjectFormData {
  id?: string;
  title: string;
  description: string;
  thumbnail: File | null;
  additionalMedia: FileList | null;
}

interface EditFormData {
  title: string;
  description: string;
}

const AdminPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [projects, setProjects] = useState(initialProjects);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalMediaPreviews, setAdditionalMediaPreviews] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<typeof projects[0] | null>(null);
  const { toast } = useToast();
  
  // Validate hash to prevent unauthorized access
  const isValidHash = (hash?: string) => {
    if (!hash) return false;
    try {
      // Check if it contains admin and is a valid base64url
      const decoded = atob(hash.replace(/-/g, '+').replace(/_/g, '/'));
      return decoded.startsWith('admin-');
    } catch {
      return false;
    }
  };
  
  const form = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      thumbnail: null,
      additionalMedia: null,
    }
  });
  
  const editForm = useForm<EditFormData>({
    defaultValues: {
      title: '',
      description: '',
    }
  });
  
  const onSubmit = async (data: ProjectFormData) => {
    // Here we would connect to Supabase to save the project
    const newProject = {
      id: Math.random().toString(36).substring(2, 9),
      title: data.title,
      description: data.description,
      thumbnail: thumbnailPreview || 'https://placehold.co/600x400?text=No+Image',
      type: 'image',
      likes: 0
    };
    
    setProjects([...projects, newProject]);
    
    toast({
      title: "Project saved",
      description: "Your project has been saved successfully.",
    });
    
    form.reset();
    setThumbnailPreview(null);
    setAdditionalMediaPreviews([]);
  };
  
  const handleEditSubmit = (data: EditFormData) => {
    if (!editingProject) return;
    
    const updatedProjects = projects.map(project => 
      project.id === editingProject.id 
        ? { ...project, title: data.title, description: data.description } 
        : project
    );
    
    setProjects(updatedProjects);
    setEditingProject(null);
    
    toast({
      title: "Project updated",
      description: "Your project has been updated successfully.",
    });
  };
  
  const deleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      // Here we would connect to Supabase to delete
      setProjects(projects.filter(project => project.id !== id));
      
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
        variant: "destructive"
      });
    }
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    form.setValue('thumbnail', file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAdditionalMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    form.setValue('additionalMedia', files);
    
    const previews: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setAdditionalMediaPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const openEditDialog = (project: typeof projects[0]) => {
    setEditingProject(project);
    editForm.reset({
      title: project.title,
      description: project.description
    });
  };
  
  // Redirect if hash is invalid
  if (!isValidHash(hash)) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-portfolio-charcoal p-4 md:p-8">
      <CustomCursor />
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-white hover:text-portfolio-darkGray mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="bg-portfolio-lightGray p-6 rounded mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-unbounded font-medium text-portfolio-white">Admin Dashboard</h1>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-portfolio-gray hover:bg-portfolio-gray/80 text-portfolio-white">
                  <Plus size={16} className="mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-portfolio-lightGray border-portfolio-gray text-portfolio-white">
                <DialogHeader>
                  <DialogTitle className="text-portfolio-white">Add New Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-portfolio-white">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Project title" {...field} className="bg-portfolio-charcoal text-portfolio-white border-portfolio-gray" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-portfolio-white">Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Project description" className="h-24 bg-portfolio-charcoal text-portfolio-white border-portfolio-gray" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel className="text-portfolio-white">Thumbnail</FormLabel>
                      <Input 
                        type="file"
                        accept="image/png,image/jpeg,image/gif"
                        onChange={handleThumbnailChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-portfolio-gray file:text-portfolio-white hover:file:bg-portfolio-gray/80 bg-portfolio-charcoal text-portfolio-white border-portfolio-gray"
                      />
                      {thumbnailPreview && (
                        <div className="mt-4 border border-portfolio-gray p-2 rounded">
                          <img src={thumbnailPreview} alt="Thumbnail Preview" className="max-h-40 mx-auto" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel className="text-portfolio-white">Additional Media</FormLabel>
                      <Input 
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/gif,video/mp4"
                        onChange={handleAdditionalMediaChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-portfolio-gray file:text-portfolio-white hover:file:bg-portfolio-gray/80 bg-portfolio-charcoal text-portfolio-white border-portfolio-gray"
                      />
                      {additionalMediaPreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {additionalMediaPreviews.map((preview, index) => (
                            <div key={index} className="border border-portfolio-gray p-1 rounded">
                              <img src={preview} alt={`Additional Media ${index + 1}`} className="h-20 w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="border-portfolio-gray text-portfolio-white hover:bg-portfolio-gray/20">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        className="bg-portfolio-gray hover:bg-portfolio-gray/80 text-portfolio-white"
                      >
                        Save Project
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Projects List */}
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-portfolio-gray/30">
                  <TableHead className="text-portfolio-white">Thumbnail</TableHead>
                  <TableHead className="text-portfolio-white">Title</TableHead>
                  <TableHead className="text-portfolio-white">Description</TableHead>
                  <TableHead className="text-portfolio-white">Likes</TableHead>
                  <TableHead className="text-portfolio-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-portfolio-gray/30">
                    <TableCell>
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="h-16 w-24 object-cover rounded" 
                      />
                    </TableCell>
                    <TableCell className="text-portfolio-white font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell className="text-portfolio-darkGray max-w-xs truncate">
                      {project.description}
                    </TableCell>
                    <TableCell className="text-portfolio-white">
                      {project.likes}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => openEditDialog(project)}
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-portfolio-darkGray hover:text-portfolio-white hover:bg-portfolio-gray/20"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          onClick={() => deleteProject(project.id)} 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-portfolio-darkGray hover:text-red-500 hover:bg-portfolio-gray/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-portfolio-darkGray">
                      No projects found. Add your first project.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="bg-portfolio-lightGray border-portfolio-gray text-portfolio-white">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="text-portfolio-white">Edit Project</DialogTitle>
            <Button 
              variant="ghost"
              size="icon"
              className="text-portfolio-darkGray hover:text-portfolio-white"
              onClick={() => setEditingProject(null)}
            >
              <X size={18} />
            </Button>
          </DialogHeader>
          
          {editingProject && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-portfolio-white">Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Project title" 
                          {...field} 
                          className="bg-portfolio-charcoal text-portfolio-white border-portfolio-gray" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-portfolio-white">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Project description" 
                          className="h-24 bg-portfolio-charcoal text-portfolio-white border-portfolio-gray" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingProject(null)}
                    className="border-portfolio-gray text-portfolio-white hover:bg-portfolio-gray/20"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-portfolio-gray hover:bg-portfolio-gray/80 text-portfolio-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
