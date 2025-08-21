INSERT INTO public.gallery_items (title, description, image_url, category, event_date, tags, created_at)
VALUES
    ('Angel Sualang', 'Foto pemain putri Angel Sualang', '/images/angel-sualang.jpg', 'pemain putri', '2024-07-28', ARRAY['pemain', 'putri'], NOW()),
    ('Calista Maya Ersandita', 'Foto pemain putri Calista Maya Ersandita', '/images/calista-maya-ersandita.jpg', 'pemain putri', '2024-07-28', ARRAY['pemain', 'putri'], NOW()),
    ('Lissa Surusa', 'Foto pemain putri Lissa Surusa', '/images/lissa-surusa.jpg', 'pemain putri', '2024-07-28', ARRAY['pemain', 'putri'], NOW()),
    ('Shelomitha Wongkar', 'Foto pemain putri Shelomitha Wongkar', '/images/shelomitha-wongkar.jpg', 'pemain putri', '2024-07-28', ARRAY['pemain', 'putri'], NOW())
ON CONFLICT (image_url) DO NOTHING;
