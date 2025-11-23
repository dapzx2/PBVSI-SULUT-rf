-- Pastikan menggunakan database yang benar
USE `PBVSI-SULUT`;

-- Buat tabel settings
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    website_name VARCHAR(255) DEFAULT 'PBVSI Sulawesi Utara',
    tagline TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo_url TEXT,
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    youtube VARCHAR(255),
    whatsapp VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert data default
INSERT IGNORE INTO settings (id, website_name, tagline, email, phone)
VALUES (
    1, 
    'PBVSI Sulawesi Utara',
    'Persatuan Bola Voli Seluruh Indonesia',
    'info@pbvsisulut.com', 
    '+62 812-3456-7890'
);

-- Cek apakah data sudah masuk
SELECT * FROM settings;
