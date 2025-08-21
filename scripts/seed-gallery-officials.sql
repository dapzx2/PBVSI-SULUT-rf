INSERT INTO public.gallery_items (title, description, image_url, category, event_date, tags, created_at)
VALUES
    ('Irjen Pol. Roycke Harry Langie', 'Ketua Umum PBVSI Sulut', '/images/irjen-pol-roycke-langie.jpg', 'pengurus', '2024-07-28', ARRAY['pejabat', 'pbvsi'], NOW()),
    ('Komjen Pol (Purn) Imam Sudjarwo', 'Ketua Umum PBVSI Pusat', '/images/imam-sudjarwo.jpeg', 'pengurus', '2024-07-28', ARRAY['pejabat', 'pbvsi'], NOW())
ON CONFLICT (image_url) DO NOTHING;
