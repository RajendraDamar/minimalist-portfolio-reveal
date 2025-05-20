
-- Create a storage bucket for project files and thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true);

-- Allow public access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'projects');

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Allow users to update their own files
CREATE POLICY "Users can update own files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
