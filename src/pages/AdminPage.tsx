
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// Form schema
interface ProjectFormData {
  title: string;
  description: string;
  media: File | null;
}

const AdminPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
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
      media: null,
    }
  });
  
  const onSubmit = async (data: ProjectFormData) => {
    // In a real implementation, this would upload to Supabase
    console.log('Project data to be uploaded:', data);
    
    toast({
      title: "Project saved",
      description: "Your project has been saved and will be connected to Supabase later.",
    });
    
    // Reset form after submit
    form.reset();
    setMediaPreview(null);
    setMediaType(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update form value
    form.setValue('media', file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    };
    reader.readAsDataURL(file);
  };
  
  // Redirect if hash is invalid
  if (!isValidHash(hash)) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-portfolio-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-charcoal hover:text-portfolio-darkGray mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="bg-portfolio-lightGray p-8 rounded-lg">
          <h1 className="text-3xl font-display font-medium mb-6">Admin Dashboard</h1>
          <p className="mb-8 text-portfolio-darkGray">Add a new project to your portfolio</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter project description" className="h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Upload Media</FormLabel>
                <Input 
                  type="file"
                  accept="image/png,image/jpeg,image/gif,video/mp4"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-dark-orchid/10 file:text-dark-orchid hover:file:bg-dark-orchid/20"
                />
                {mediaPreview && (
                  <div className="mt-4 border border-portfolio-gray p-2 rounded">
                    <p className="text-sm text-portfolio-darkGray mb-2">Preview:</p>
                    {mediaType === 'video' ? (
                      <video src={mediaPreview} controls className="max-h-60 mx-auto" />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="max-h-60 mx-auto" />
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-dark-orchid hover:bg-dark-orchid/80 text-white"
              >
                Save Project
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="mt-8 text-center text-sm text-portfolio-darkGray">
          <p>This form will be connected to Supabase for data storage in a future update.</p>
        </div>
      </div>
      
      {/* Purple flare element */}
      <div className="fixed -bottom-20 -right-20 w-96 h-96 rounded-full bg-dark-orchid opacity-20 blur-3xl -z-10"></div>
    </div>
  );
};

export default AdminPage;
