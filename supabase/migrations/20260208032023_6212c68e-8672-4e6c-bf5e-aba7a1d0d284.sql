
-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload report images
CREATE POLICY "Authenticated users can upload report images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-images'
  AND auth.role() = 'authenticated'
);

-- Allow anyone to view report images (public bucket)
CREATE POLICY "Anyone can view report images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own report images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'report-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
