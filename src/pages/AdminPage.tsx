
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import CustomCursor from '@/components/CustomCursor';
import { useProjects, Project } from '@/hooks/useProjects';
import { supabase } from '@/integrations/supabase/client';
import FileUpload from '@/components/FileUpload';

// Form schemas
interface ProjectFormData {
  title: string;
  description: string;
  thumbnail: string;
  type: 'image' | 'video';
  aspect_ratio: string;
}

interface EditFormData {
  title: string;
  description: string;
  thumbnail?: string;
}

const AdminPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const { projects, loading, fetchProjects, addProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const navigate = useNavigate();
  const initialLoadComplete = useRef(false);
  
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
      thumbnail: '',
      type: 'image',
      aspect_ratio: 'aspect-[4/3]',
    }
  });
  
  const editForm = useForm<EditFormData>({
    defaultValues: {
      title: '',
      description: '',
      thumbnail: '',
    }
  });
  
  // Modified onSubmit to handle both URL and file upload
  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSaving(true);
      
      await addProject({
        title: data.title,
        description: data.description,
        thumbnail: thumbnailPreview || data.thumbnail || 'https://placehold.co/600x400?text=No+Image',
        type: data.type,
        likes: 0,
        aspect_ratio: data.aspect_ratio,
      }, thumbnailFile || undefined);
      
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully.",
      });
      
      form.reset();
      setThumbnailPreview(null);
      setThumbnailFile(null);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEditSubmit = async (data: EditFormData) => {
    if (!editingProject) return;
    
    try {
      setIsSaving(true);
      
      await updateProject(editingProject.id, {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail
      }, editThumbnailFile || undefined);
      
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });
      
      setEditingProject(null);
      setEditThumbnailFile(null);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setIsDeleting(id);
        await deleteProject(id);
        
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
          variant: "destructive"
        });
      } catch (error) {
        console.error('Error deleting project:', error);
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('thumbnail', value);
    setThumbnailPreview(value);
  };

  const handleFileSelected = (file: File) => {
    setThumbnailFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileSelected = (file: File) => {
    setEditThumbnailFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      editForm.setValue('thumbnail', reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    editForm.reset({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail
    });
  };
  
  // Fetch projects only once when the component mounts
  useEffect(() => {
    if (!initialLoadComplete.current) {
      fetchProjects();
      initialLoadComplete.current = true;
    }
  }, [fetchProjects]);
  
  // Redirect if hash is invalid
  if (!isValidHash(hash)) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-portfolio-charcoal p-4 md:p-8">
      <CustomCursor />
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-white hover:text-portfolio-darkGray mb-8 hover:bg-portfolio-lightGray/40 px-3 py-2 rounded-md">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="bg-portfolio-lightGray p-6 rounded mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-unbounded font-medium text-portfolio-white">Admin Dashboard</h1>
            
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-portfolio-gray hover:bg-portfolio-gray/80 text-portfolio-white">
                  <Plus size={16} className="mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-portfolio-lightGray border-portfolio-gray text-portfolio-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-portfolio-white">Add New Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
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
                        
                        <FormField
                          control={form.control}
                          name="aspect_ratio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-portfolio-white">Aspect Ratio</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full bg-portfolio-charcoal text-portfolio-white border border-portfolio-gray rounded p-2"
                                >
                                  <option value="aspect-[4/3]">4:3</option>
                                  <option value="aspect-[16/9]">16:9</option>
                                  <option value="aspect-[1/1]">1:1</option>
                                  <option value="aspect-[3/4]">3:4</option>
                                  <option value="aspect-[4/5]">4:5</option>
                                  <option value="aspect-[3/2]">3:2</option>
                                  <option value="aspect-[2/3]">2:3</option>
                                </select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="thumbnail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-portfolio-white">Thumbnail</FormLabel>
                              <div className="space-y-2">
                                <FormLabel className="text-sm text-portfolio-darkGray">Upload an image</FormLabel>
                                <FileUpload 
                                  onFileSelect={handleFileSelected} 
                                  buttonText="Upload Thumbnail"
                                  currentUrl={thumbnailPreview || undefined}
                                />
                                
                                <div className="my-1 text-center text-portfolio-darkGray">or</div>
                                
                                <FormLabel className="text-sm text-portfolio-darkGray">Use an external URL</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/image.jpg"
                                    value={field.value}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleThumbnailChange(e);
                                    }}
                                    className="bg-portfolio-charcoal text-portfolio-white border-portfolio-gray"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
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
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Project'
                        )}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-portfolio-darkGray">
                      <div className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading projects...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-portfolio-darkGray">
                      No projects found. Add your first project.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
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
                            onClick={() => handleDeleteProject(project.id)} 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-portfolio-darkGray hover:text-red-500 hover:bg-portfolio-gray/20"
                            disabled={isDeleting === project.id}
                          >
                            {isDeleting === project.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="bg-portfolio-lightGray border-portfolio-gray text-portfolio-white max-w-2xl">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
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
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={editForm.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-portfolio-white">Thumbnail</FormLabel>
                          <div className="space-y-2">
                            <FormLabel className="text-sm text-portfolio-darkGray">Current Thumbnail</FormLabel>
                            <img 
                              src={field.value} 
                              alt="Current Thumbnail" 
                              className="h-32 object-contain mx-auto border border-portfolio-gray/30 p-1" 
                            />
                            
                            <FormLabel className="text-sm text-portfolio-darkGray mt-4">Upload new image</FormLabel>
                            <FileUpload 
                              onFileSelect={handleEditFileSelected} 
                              buttonText="Change Thumbnail"
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
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
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
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
