-- 1. Create table for Mushala Events
CREATE TABLE IF NOT EXISTS mushala_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_event TEXT NOT NULL,
    tanggal DATE NOT NULL,
    jam TIME NOT NULL,
    keterangan TEXT,
    poster_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Insert storage bucket for Event Posters
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event_posters', 'event_posters', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies for the new bucket (allow all for simplicity in MVP, adjust in production)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'event_posters' );

CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'event_posters' );

CREATE POLICY "Allow Updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'event_posters' );

CREATE POLICY "Allow Deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'event_posters' );
