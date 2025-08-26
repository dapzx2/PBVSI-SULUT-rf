-- This script defines the database schema for the Volleybox clone application in MySQL.

-- Create clubs table first, as it's referenced by players and matches
CREATE TABLE IF NOT EXISTS `clubs` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100),
    `country` VARCHAR(100),
    `logo_url` VARCHAR(255),
    `established_year` INT,
    `coach_name` VARCHAR(255),
    `home_arena` VARCHAR(255),
    `description` TEXT,
    `achievements` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create players table, referencing clubs
CREATE TABLE IF NOT EXISTS `players` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `position` VARCHAR(50),
    `height_cm` INT,
    `weight_kg` INT,
    `birth_date` DATE,
    `country` VARCHAR(100),
    `image_url` VARCHAR(255),
    `club_id` VARCHAR(36),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` VARCHAR(36) PRIMARY KEY,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` TEXT NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `role` VARCHAR(50) DEFAULT 'admin',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_sessions table, referencing admin_users
CREATE TABLE IF NOT EXISTS `admin_sessions` (
    `id` VARCHAR(36) PRIMARY KEY,
    `admin_user_id` VARCHAR(36) NOT NULL,
    `token_hash` TEXT NOT NULL,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE
);

-- Create admin_activity_logs table, referencing admin_users
CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
    `id` VARCHAR(36) PRIMARY KEY,
    `admin_user_id` VARCHAR(36),
    `action` TEXT NOT NULL,
    `resource_type` VARCHAR(50),
    `resource_id` VARCHAR(36),
    `details` JSON,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL
);

-- Create matches table, referencing clubs
CREATE TABLE IF NOT EXISTS `matches` (
    `id` VARCHAR(36) PRIMARY KEY,
    `home_team_id` VARCHAR(36),
    `away_team_id` VARCHAR(36),
    `match_date` TIMESTAMP NOT NULL,
    `venue` VARCHAR(255),
    `score_home_sets` INT,
    `score_away_sets` INT,
    `score_home_points` JSON,
    `score_away_points` JSON,
    `status` VARCHAR(50),
    `league` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`home_team_id`) REFERENCES `clubs`(`id`),
    FOREIGN KEY (`away_team_id`) REFERENCES `clubs`(`id`)
);

-- Create articles table
CREATE TABLE IF NOT EXISTS `articles` (
    `id` VARCHAR(36) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `content` TEXT NOT NULL,
    `image_url` VARCHAR(255),
    `author` VARCHAR(100),
    `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `category` VARCHAR(50),
    `tags` JSON,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS `gallery_items` (
    `id` VARCHAR(36) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image_url` VARCHAR(255) NOT NULL UNIQUE,
    `category` VARCHAR(50),
    `event_date` DATE,
    `tags` JSON,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create match_events table, referencing matches, clubs, and players
CREATE TABLE IF NOT EXISTS `match_events` (
    `id` VARCHAR(36) PRIMARY KEY,
    `match_id` VARCHAR(36),
    `event_type` VARCHAR(50) NOT NULL,
    `description` TEXT, 
    `team_id` VARCHAR(36),
    `player_id` VARCHAR(36),
    `set_number` INT,
    `score_home` INT,
    `score_away` INT,
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`team_id`) REFERENCES `clubs`(`id`),
    FOREIGN KEY (`player_id`) REFERENCES `players`(`id`)
);

-- Create predictions table, referencing matches and clubs
CREATE TABLE IF NOT EXISTS `predictions` (
    `id` VARCHAR(36) PRIMARY KEY,
    `match_id` VARCHAR(36),
    `user_id` VARCHAR(36),
    `predicted_winner_id` VARCHAR(36),
    `predicted_score_home_sets` INT,
    `predicted_score_away_sets` INT,
    `prediction_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`predicted_winner_id`) REFERENCES `clubs`(`id`)
);

-- Create activity_logs table (user_id is not a foreign key here, so order doesn't strictly matter)
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36),
    `action` TEXT NOT NULL,
    `entity_type` VARCHAR(50),
    `entity_id` VARCHAR(36),
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
);
