INSERT INTO public.gallery_items (title, description, image_url, category, event_date, tags, created_at)
VALUES
    ('Aprilio Perkasa Manganang', 'Foto pemain putra Aprilio Perkasa Manganang', '/images/aprilio-perkasa-manganang.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW()),
    ('Christian Rooroh', 'Foto pemain putra Christian Rooroh', '/images/christian-rooroh.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW()),
    ('Dimas Saputra Pratama', 'Foto pemain putra Dimas Saputra Pratama', '/images/dimas-saputra-pratama.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW()),
    ('Jasen Natanael Kilanta', 'Foto pemain putra Jasen Natanael Kilanta', '/images/jasen-natanael-kilanta.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW()),
    ('Jerel Susanto', 'Foto pemain putra Jerel Susanto', '/images/jerel-susanto.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW()),
    ('Jordan Michael Imanuel', 'Foto pemain putra Jordan Michael Imanuel', '/images/jordan-michael-imanuel.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW()),
    ('Rendy Tamamilang', 'Foto pemain putra Rendy Tamamilang', '/images/rendy-tamamilang.jpg', 'pemain putra', '2024-07-28', ARRAY['pemain', 'putra'], NOW())
ON CONFLICT (image_url) DO NOTHING;
