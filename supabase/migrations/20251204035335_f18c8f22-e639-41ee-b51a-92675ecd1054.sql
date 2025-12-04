-- Create notes table for PDF documents
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Everyone can view notes
CREATE POLICY "Everyone can view notes"
ON public.notes
FOR SELECT
USING (true);

-- Admins can manage notes
CREATE POLICY "Admins can manage notes"
ON public.notes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for notes PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true);

-- Storage policies for notes bucket
CREATE POLICY "Anyone can view notes files"
ON storage.objects FOR SELECT
USING (bucket_id = 'notes');

CREATE POLICY "Admins can upload notes files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'notes' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notes files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'notes' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notes files"
ON storage.objects FOR DELETE
USING (bucket_id = 'notes' AND has_role(auth.uid(), 'admin'::app_role));