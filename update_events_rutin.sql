-- Tambahkan kolom is_rutin untuk menandai event yang berulang setiap minggu
ALTER TABLE mushala_events 
ADD COLUMN IF NOT EXISTS is_rutin BOOLEAN DEFAULT false;
