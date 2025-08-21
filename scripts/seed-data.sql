-- Insert sample clubs
INSERT INTO clubs (id, name, city, country, founded_year, logo_url, contact_info) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jakarta LavAni Allo Bank', 'Jakarta', 'Indonesia', 2010, '/placeholder-logo.png', '{"phone": "(021) 555-0101", "email": "info@jakartalavani.example"}'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Surabaya BIN Samator', 'Surabaya', 'Indonesia', 2012, '/placeholder-logo.png', '{"phone": "(031) 555-0102", "email": "info@surabayabin.example"}'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Bandung BJB Tandamata', 'Bandung', 'Indonesia', 2008, '/placeholder-logo.png', '{"phone": "(022) 555-0103", "email": "info@bandungbjb.example"}'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Jakarta Pertamina Fastron', 'Jakarta', 'Indonesia', 2015, '/placeholder-logo.png', '{"phone": "(021) 555-0104", "email": "info@jakartapertamina.example"}'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Manado Volleyball Club', 'Manado', 'Indonesia', 2010, '/images/clubs/manado-vc.png', '{"phone": "(0431) 555-0101", "email": "info@manadovc.example"}'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Tomohon Spikers', 'Tomohon', 'Indonesia', 2012, '/images/clubs/tomohon-spikers.png', '{"phone": "(0431) 555-0102", "email": "info@tomohonspikers.example"}'),
('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Minahasa Eagles', 'Tondano', 'Indonesia', 2008, '/images/clubs/minahasa-eagles.png', '{"phone": "(0431) 555-0103", "email": "info@minahasaeagles.example"}'),
('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Bitung Sharks', 'Bitung', 'Indonesia', 2015, '/images/clubs/bitung-sharks.png', '{"phone": "(0431) 555-0104", "email": "info@bitungsharks.example"}'),
('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Kotamobagu Smashers', 'Kotamobagu', 'Indonesia', 2018, '/images/clubs/kotamobagu-smashers.png', '{"phone": "(0431) 555-0105", "email": "info@kotamobagusmashers.example"}'),
('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Sangihe Islanders', 'Tahuna', 'Indonesia', 2014, '/images/clubs/sangihe-islanders.png', '{"phone": "(0431) 555-0106", "email": "info@sangiheis.example"}')
ON CONFLICT (id) DO NOTHING; -- Added ON CONFLICT to prevent duplicates

-- Insert sample players
INSERT INTO players (id, name, position, club_id, birth_date, height_cm, weight_kg, photo_url, achievements) VALUES
(uuid_generate_v4(), 'Angel Sualang', 'Outside Hitter', (SELECT id FROM clubs WHERE name = 'Manado Volleyball Club'), '1998-05-15', 175, 65, '/images/angel-sualang.jpg', '["Juara 1 Liga Voli Sulut 2023", "MVP Turnamen Nasional 2022"]'),
(uuid_generate_v4(), 'Aprilio Perkasa Manganang', 'Middle Blocker', (SELECT id FROM clubs WHERE name = 'Manado Volleyball Club'), '1996-08-22', 192, 78, '/images/aprilio-perkasa-manganang.jpg', '["Juara 2 PON XX Papua 2021", "Best Blocker Liga Voli Nasional 2023"]'),
(uuid_generate_v4(), 'Calista Maya Ersandita', 'Setter', (SELECT id FROM clubs WHERE name = 'Tomohon Spikers'), '1999-03-10', 168, 58, '/images/calista-maya-ersandita.jpg', '["Best Setter Liga Voli Sulut 2023", "Juara 3 Kejurnas Voli Putri 2022"]'),
(uuid_generate_v4(), 'Christian Rooroh', 'Opposite', (SELECT id FROM clubs WHERE name = 'Minahasa Eagles'), '1997-11-05', 188, 75, '/images/christian-rooroh.jpg', '["Top Scorer Liga Voli Sulut 2022", "Juara 1 Turnamen Antar Klub 2023"]'),
(uuid_generate_v4(), 'Dimas Saputra Pratama', 'Outside Hitter', (SELECT id FROM clubs WHERE name = 'Bitung Sharks'), '2000-01-18', 185, 72, '/images/dimas-saputra-pratama.jpg', '["Rookie of the Year 2022", "Juara 2 Liga Voli Sulut 2023"]'),
(uuid_generate_v4(), 'Jasen Natanael Kilanta', 'Libero', (SELECT id FROM clubs WHERE name = 'Kotamobagu Smashers'), '1998-09-12', 172, 68, '/images/jasen-natanael-kilanta.jpg', '["Best Libero Liga Voli Sulut 2023", "Juara 1 Turnamen Pelajar 2021"]'),
(uuid_generate_v4(), 'Jerel Susanto', 'Setter', (SELECT id FROM clubs WHERE name = 'Sangihe Islanders'), '1995-07-30', 180, 70, '/images/jerel-susanto.jpg', '["Veteran Player Award 2023", "Juara 3 Liga Voli Nasional 2020"]'),
(uuid_generate_v4(), 'Jordan Michael Imanuel', 'Middle Blocker', (SELECT id FROM clubs WHERE name = 'Manado Volleyball Club'), '1999-12-03', 195, 82, '/images/jordan-michael-imanuel.jpg', '["Best Young Player 2022", "Juara 1 Liga Voli Sulut 2023"]'),
(uuid_generate_v4(), 'Lissa Surusa', 'Outside Hitter', (SELECT id FROM clubs WHERE name = 'Tomohon Spikers'), '1997-04-25', 170, 62, '/images/lissa-surusa.jpg', '["MVP Liga Voli Putri Sulut 2023", "Juara 2 Kejurnas Voli 2022"]'),
(uuid_generate_v4(), 'Rendy Tamamilang', 'Opposite', (SELECT id FROM clubs WHERE name = 'Minahasa Eagles'), '1996-06-14', 190, 76, '/images/rendy-tamamilang.jpg', '["Top Scorer Turnamen Nasional 2022", "Juara 1 Liga Voli Sulut 2023"]'),
(uuid_generate_v4(), 'Shelomitha Wongkar', 'Libero', (SELECT id FROM clubs WHERE name = 'Bitung Sharks'), '1998-10-08', 165, 55, '/images/shelomitha-wongkar.jpg', '["Best Defensive Player 2023", "Juara 2 Liga Voli Putri Sulut 2023"]'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Fahry Septian Putratama', 'Outside Hitter', (SELECT id FROM clubs WHERE name = 'Jakarta LavAni Allo Bank'), '1998-09-26', 190, 85, '/placeholder-user.jpg', '[]'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Rivan Nurmulki', 'Opposite', (SELECT id FROM clubs WHERE name = 'Surabaya BIN Samator'), '1995-07-16', 198, 95, '/placeholder-user.jpg', '[]')
ON CONFLICT (id) DO NOTHING;

-- Insert sample matches
INSERT INTO matches (id, home_team_id, away_team_id, match_date, venue, score_home_sets, score_away_sets, score_home_points, score_away_points, status, league) VALUES
(uuid_generate_v4(), (SELECT id FROM clubs WHERE name = 'Manado Volleyball Club'), (SELECT id FROM clubs WHERE name = 'Tomohon Spikers'), '2024-01-20 19:00:00+08', 'GOR Kota Manado', 3, 1, '[25, 22, 25]', '[23, 25, 22]', 'finished', 'Liga Voli Sulut 2024'),
(uuid_generate_v4(), (SELECT id FROM clubs WHERE name = 'Minahasa Eagles'), (SELECT id FROM clubs WHERE name = 'Bitung Sharks'), '2024-01-21 19:00:00+08', 'GOR Tondano', 2, 3, '[25, 23, 25, 22]', '[22, 25, 23, 25]', 'finished', 'Liga Voli Sulut 2024'),
(uuid_generate_v4(), (SELECT id FROM clubs WHERE name = 'Kotamobagu Smashers'), (SELECT id FROM clubs WHERE name = 'Sangihe Islanders'), '2024-01-25 19:00:00+08', 'GOR Kotamobagu', 2, 3, '[25, 22, 25, 22]', '[23, 25, 23, 25]', 'live', 'Liga Voli Sulut 2024'),
(uuid_generate_v4(), (SELECT id FROM clubs WHERE name = 'Tomohon Spikers'), (SELECT id FROM clubs WHERE name = 'Minahasa Eagles'), '2024-01-27 19:00:00+08', 'GOR Tomohon', 0, 0, '[]', '[]', 'upcoming', 'Liga Voli Sulut 2024'),
(uuid_generate_v4(), (SELECT id FROM clubs WHERE name = 'Bitung Sharks'), (SELECT id FROM clubs WHERE name = 'Manado Volleyball Club'), '2024-01-28 19:00:00+08', 'GOR Bitung', 0, 0, '[]', '[]', 'upcoming', 'Liga Voli Sulut 2024'),
('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', (SELECT id FROM clubs WHERE name = 'Jakarta LavAni Allo Bank'), (SELECT id FROM clubs WHERE name = 'Surabaya BIN Samator'), '2024-08-01 14:00:00+07', 'GOR Among Rogo', 3, 1, '[25, 23, 20, 25]', '[23, 25, 25, 20]', 'finished', 'Pro Liga'),
('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', (SELECT id FROM clubs WHERE name = 'Bandung BJB Tandamata'), (SELECT id FROM clubs WHERE name = 'Jakarta Pertamina Fastron'), '2024-08-02 16:00:00+07', 'GOR Ken Arok', 2, 3, '[25, 20, 25, 22, 10]', '[23, 25, 23, 25, 15]', 'finished', 'Pro Liga')
ON CONFLICT (id) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (id, title, content, image_url, author, published_at, category, tags) VALUES
(uuid_generate_v4(), 'PBVSI Sulut Gelar Turnamen Antar Klub 2024', 'Persatuan Bola Voli Seluruh Indonesia (PBVSI) Sulawesi Utara menggelar turnamen antar klub yang diikuti oleh 12 klub dari seluruh Sulawesi Utara. Turnamen ini bertujuan untuk meningkatkan prestasi bola voli di daerah dan mencari bibit-bibit atlet muda berbakat.

Ketua PBVSI Sulut, Imam Sudjarwo mengatakan bahwa turnamen ini merupakan bagian dari program pembinaan berkelanjutan untuk mengembangkan bola voli di Sulawesi Utara. "Kami berharap melalui turnamen ini dapat lahir atlet-atlet berprestasi yang dapat mengharumkan nama Sulawesi Utara di tingkat nasional," ujarnya.

Turnamen yang berlangsung selama dua minggu ini diikuti oleh klub-klub terbaik dari berbagai kota dan kabupaten di Sulawesi Utara, termasuk Manado Volleyball Club, Tomohon Spikers, dan Minahasa Eagles.',
'/images/smansa-manado-tournament.jpg',
'Admin PBVSI Sulut',
'2024-01-15 10:00:00+08',
'turnamen',
'{"turnamen", "pbvsi", "sulut", "bola voli"}'),

(uuid_generate_v4(), 'Pelatihan Pelatih Bersertifikat Tingkat Provinsi', 'PBVSI Sulawesi Utara menyelenggarakan pelatihan pelatih bersertifikat tingkat provinsi yang diikuti oleh 30 peserta dari berbagai klub di Sulawesi Utara. Pelatihan ini bertujuan untuk meningkatkan kualitas pelatih bola voli di daerah.

Materi pelatihan meliputi teknik dasar bola voli, strategi permainan, psikologi olahraga, dan manajemen tim. Pelatihan dipimpin oleh instruktur nasional yang berpengalaman dalam pembinaan bola voli.

"Pelatih yang berkualitas adalah kunci utama dalam menghasilkan atlet-atlet berprestasi. Melalui pelatihan ini, kami berharap dapat meningkatkan standar pelatihan bola voli di Sulawesi Utara," kata Ketua PBVSI Sulut.',
'/images/volleyball-court-training.webp',
'Admin PBVSI Sulut',
'2024-01-10 14:30:00+08',
'pelatihan',
'{"pelatihan", "pelatih", "sertifikat", "pembinaan"}'),

(uuid_generate_v4(), 'Atlet Sulut Raih Prestasi di Kejurnas Bola Voli', 'Atlet bola voli asal Sulawesi Utara berhasil meraih prestasi membanggakan di Kejuaraan Nasional Bola Voli yang diselenggarakan di Jakarta. Tim putri Sulut berhasil meraih medali perak, sementara tim putra finish di posisi keempat.

Angel Sualang dan Lissa Surusa menjadi bintang tim putri dengan penampilan yang konsisten sepanjang turnamen. Sementara itu, Aprilio Perkasa Manganang dan Christian Rooroh memberikan kontribusi besar untuk tim putra.

"Ini adalah hasil dari pembinaan yang konsisten dan kerja keras para atlet. Kami bangga dengan pencapaian ini dan akan terus berusaha meningkatkan prestasi," ungkap Ketua PBVSI Sulut.',
'/images/jordan-susanto-news.jpg',
'Admin PBVSI Sulut',
'2024-01-05 16:00:00+08',
'prestasi',
'{"prestasi", "kejurnas", "medali", "atlet"}'),

('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'LavAni Juara Pro Liga 2024', 'Jakarta LavAni Allo Bank berhasil meraih gelar juara Pro Liga 2024 setelah mengalahkan Surabaya BIN Samator di final.', '/placeholder.jpg', 'Admin PBVSI', '2024-08-01 18:00:00+07', 'berita', ARRAY['proliga', 'lavani', 'juara'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample gallery items
INSERT INTO gallery_items (id, title, description, image_url, category, event_date, tags) VALUES
(uuid_generate_v4(), 'Final Turnamen Antar Klub Sulut 2024', 'Pertandingan final yang mempertemukan Manado VC vs Tomohon Spikers di GOR Kota Manado', '/images/smansa-manado-tournament.jpg', 'turnamen', '2024-01-20', '{"final", "turnamen", "manado", "tomohon"}'),
(uuid_generate_v4(), 'Sesi Latihan Tim Putri', 'Latihan rutin tim putri PBVSI Sulut dalam persiapan menghadapi kejuaraan nasional', '/images/volleyball-court-training.webp', 'latihan', '2024-01-18', '{"latihan", "tim putri", "persiapan"}'),
(uuid_generate_v4(), 'Penyerahan Medali Kejurnas', 'Momen penyerahan medali perak untuk tim putri Sulut di Kejuaraan Nasional Bola Voli', '/images/jordan-susanto-tournament.jpg', 'prestasi', '2024-01-15', '{"medali", "kejurnas", "prestasi"}'),
(uuid_generate_v4(), 'Workshop Pelatih Tingkat Provinsi', 'Kegiatan workshop untuk meningkatkan kompetensi pelatih bola voli di Sulawesi Utara', '/images/jordan-susanto-news.jpg', 'pelatihan', '2024-01-12', '{"workshop", "pelatih", "kompetensi"}'),
(uuid_generate_v4(), 'Atlet Berprestasi PBVSI Sulut', 'Foto bersama para atlet berprestasi PBVSI Sulawesi Utara tahun 2024', '/images/aprilio-perkasa-manganang.jpg', 'atlet', '2024-01-10', '{"atlet", "prestasi", "foto bersama"}'),
(uuid_generate_v4(), 'Rapat Koordinasi Pengurus', 'Rapat koordinasi bulanan pengurus PBVSI Sulawesi Utara membahas program kerja', '/images/imam-sudjarwo.jpeg', 'kegiatan', '2024-01-08', '{"rapat", "koordinasi", "pengurus"}'),
('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Latihan Tim Nasional', 'Sesi latihan rutin tim nasional voli putra.', '/public/images/volleyball-court-training.webp', 'pelatihan', '2024-07-20', ARRAY['timnas', 'latihan'])
ON CONFLICT (id) DO NOTHING;

-- Seed clubs data
INSERT INTO public.clubs (id, name, city, country, logo_url, established_year, created_at)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jakarta LavAni Allo Bank', 'Jakarta', 'Indonesia', '/placeholder-logo.png', 2021, NOW()),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Surabaya BIN Samator', 'Surabaya', 'Indonesia', '/placeholder-logo.png', 2002, NOW()),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Bandung BJB Tandamata', 'Bandung', 'Indonesia', '/placeholder-logo.png', 2003, NOW()),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Jakarta Pertamina Fastron', 'Jakarta', 'Indonesia', '/placeholder-logo.png', 2012, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed players data
INSERT INTO public.players (id, name, position, height_cm, weight_kg, birth_date, country, image_url, club_id, created_at)
VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Dimas Saputra Pratama', 'Opposite Hitter', 188, 80, '1995-10-23', 'Indonesia', '/images/dimas-saputra-pratama.jpg', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Rendy Tamamilang', 'Outside Hitter', 190, 85, '1996-02-09', 'Indonesia', '/images/rendy-tamamilang.jpg', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),
    ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Aprilio Perkasa Manganang', 'Opposite Hitter', 170, 70, '1992-04-27', 'Indonesia', '/images/aprilio-perkasa-manganang.jpg', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),
    ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Shelomitha Wongkar', 'Setter', 175, 65, '1998-03-15', 'Indonesia', '/images/shelomitha-wongkar.jpg', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', NOW()),
    ('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Angel Sualang', 'Libero', 165, 58, '2000-07-01', 'Indonesia', '/images/angel-sualang.jpg', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),
    ('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Calista Maya Ersandita', 'Middle Blocker', 180, 70, '2001-01-20', 'Indonesia', '/images/calista-maya-ersandita.jpg', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', NOW()),
    ('k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Christian Rooroh', 'Outside Hitter', 185, 78, '1997-05-10', 'Indonesia', '/images/christian-rooroh.jpg', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
    ('l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Jasen Natanael Kilanta', 'Setter', 178, 70, '1999-11-29', 'Indonesia', '/images/jasen-natanael-kilanta.jpg', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),
    ('m0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Jerel Susanto', 'Middle Blocker', 192, 88, '1994-08-03', 'Indonesia', '/images/jerel-susanto.jpg', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
    ('n0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Jordan Michael Imanuel', 'Opposite Hitter', 187, 82, '1993-06-18', 'Indonesia', '/images/jordan-michael-imanuel.jpg', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),
    ('o0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'Lissa Surusa', 'Outside Hitter', 172, 63, '1999-09-05', 'Indonesia', '/images/lissa-surusa.jpg', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed articles data
INSERT INTO public.articles (id, title, content, image_url, author, published_at, category, tags, created_at)
VALUES
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'PBVSI Sulut Gelar Turnamen Voli Antar Klub', 'PBVSI Sulawesi Utara sukses menggelar turnamen bola voli antar klub se-Sulut yang diikuti oleh 16 tim putra dan 12 tim putri. Acara ini bertujuan untuk mencari bibit-bibit unggul dan meningkatkan kualitas voli di daerah.', '/images/smansa-manado-tournament.jpg', 'Admin PBVSI', '2024-07-25 10:00:00+07', 'Berita', ARRAY['turnamen', 'sulut', 'pbvsi'], NOW()),
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Pemain Muda Jordan Susanto Raih Penghargaan MVP', 'Jordan Susanto, pemain muda berbakat dari klub Jakarta LavAni, berhasil meraih penghargaan Most Valuable Player (MVP) dalam turnamen Proliga 2024. Penampilannya yang konsisten dan memukau menjadi kunci keberhasilan timnya.', '/images/jordan-susanto-news.jpg', 'Redaksi Voli', '2024-07-20 14:30:00+07', 'Berita', ARRAY['pemain', 'proliga', 'mvp'], NOW()),
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Strategi Latihan Baru Tim Nasional Voli Indonesia', 'Tim nasional bola voli Indonesia menerapkan strategi latihan baru di bawah arahan pelatih kepala. Fokus utama adalah peningkatan fisik, teknik serangan cepat, dan koordinasi tim untuk menghadapi kejuaraan Asia.', '/public/images/volleyball-court-training.webp', 'Pelatih Timnas', '2024-07-18 09:00:00+07', 'Berita', ARRAY['timnas', 'latihan', 'strategi'], NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed matches data
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, score_home_sets, score_away_sets, score_home_points, score_away_points, status, league, created_at)
VALUES
    ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-08-01 16:00:00+07', 'GOR Jakarta', 3, 1, '[25, 23, 20, 25]', '[23, 25, 25, 20]', 'finished', 'Proliga 2024', NOW()),
    ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2024-08-02 18:00:00+07', 'GOR Bandung', 2, 3, '[25, 20, 25, 22, 13]', '[23, 25, 23, 25, 15]', 'finished', 'Proliga 2024', NOW()),
    ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2024-08-05 19:00:00+07', 'GOR Jakarta', NULL, NULL, NULL, NULL, 'upcoming', 'Proliga 2024', NOW())
ON CONFLICT (id) DO NOTHING;
