
-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true);

-- Create policy to allow public read access
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Upload Access"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects');

-- Create policy to allow authenticated users to update files
CREATE POLICY "Update Access"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'projects');

-- Create policy to allow authenticated users to delete files
CREATE POLICY "Delete Access"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'projects');
