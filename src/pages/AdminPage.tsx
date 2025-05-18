
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
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
    console.log('Project data to be uploaded:', data);
    
    toast({
      title: "Project saved",
      description: "Your project has been saved and will be connected to Supabase later.",
    });
    
    form.reset();
    setMediaPreview(null);
    setMediaType(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    form.setValue('media', file);
    
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
    <div className="min-h-screen bg-portfolio-charcoal p-8">
      <div className="max-w-xl mx-auto">
        <Link to="/" className="inline-flex items-center text-portfolio-white hover:text-portfolio-darkGray mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="bg-portfolio-lightGray p-6 rounded">
          <h1 className="text-2xl font-unbounded font-medium mb-6 text-portfolio-white">Admin</h1>
          
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
                <FormLabel className="text-portfolio-white">Media</FormLabel>
                <Input 
                  type="file"
                  accept="image/png,image/jpeg,image/gif,video/mp4"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-portfolio-gray file:text-portfolio-white hover:file:bg-portfolio-gray/80 bg-portfolio-charcoal text-portfolio-white border-portfolio-gray"
                />
                {mediaPreview && (
                  <div className="mt-4 border border-portfolio-gray p-2 rounded">
                    {mediaType === 'video' ? (
                      <video src={mediaPreview} controls className="max-h-40 mx-auto" />
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="max-h-40 mx-auto" />
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-portfolio-gray hover:bg-portfolio-gray/80 text-portfolio-white"
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
