export interface Player {
  id: string
  name: string
  position: string
  club_id: string | null
  birth_date: string // YYYY-MM-DD
  height: number // in cm
  weight: number // in kg
  photo_url: string | null
  achievements: string | null // JSON array of strings
  created_at: string
  updated_at: string
  club?: Club // Joined club data
}

export interface Club {
  id: string
  name: string
  slug: string
  city: string
  established_year: number
  coach_name: string | null
  home_arena: string | null
  logo_url: string | null
  description: string | null
  achievements: string | null
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author: string
  category: string
  image_url: string | null
  published_at: string // ISO string or similar
  created_at: string
  updated_at: string
  views?: number
  comments?: number
}

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: "putra" | "putri" | "official" | "news" | "club_logo" | "other"
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  match_date: string // ISO string or similar
  score_home: number | null
  score_away: number | null
  score_home_sets: number | null
  score_away_sets: number | null
  score_home_points: number[] | null; // Array of scores per set for home team
  score_away_points: number[] | null; // Array of scores per set for away team
  status: "scheduled" | "live" | "finished"
  league: string | null
  venue: string | null
  created_at: string
  updated_at: string
  home_team?: Club
  away_team?: Club
}

export interface AdminUser {
  id: string
  username: string
  email: string
  password_hash: string
  role: "super_admin" | "admin"
  created_at: string
}