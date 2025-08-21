export interface Player {
  id: string
  name: string
  position: string
  age?: number
  height?: number
  nationality?: string
  jerseyNumber?: number
  status?: string
  stats?: {
    points?: number
    spikes?: number
    blocks?: number
    serves?: number
    digs?: number
    sets?: number
    matches?: number
    rating?: number
  }
}

export interface Club {
  id: string
  name: string
  slug: string
  location: string
  description?: string
  foundedYear?: number
  logo?: string
}

export const clubs: Club[] = [
  {
    id: "1",
    name: "Manado Volleyball Club",
    slug: "manado-vc",
    location: "Manado, Sulawesi Utara",
    description:
      "Manado Volleyball Club adalah klub voli profesional yang berbasis di Manado, Sulawesi Utara. Didirikan pada tahun 2010, klub ini telah menjadi salah satu klub voli terkemuka di wilayah Sulawesi Utara dengan berbagai prestasi di tingkat regional dan nasional.",
    foundedYear: 2010,
    logo: "/placeholder-logo.png",
  },
  {
    id: "2",
    name: "Tomohon Spikers",
    slug: "tomohon-spikers",
    location: "Tomohon, Sulawesi Utara",
    description:
      "Tomohon Spikers adalah klub voli yang berbasis di kota Tomohon. Klub ini fokus pada pengembangan atlet muda dan telah menghasilkan beberapa pemain yang memperkuat tim nasional Indonesia.",
    foundedYear: 2012,
    logo: "/placeholder-logo.png",
  },
  {
    id: "3",
    name: "Minahasa Eagles",
    slug: "minahasa-eagles",
    location: "Tondano, Minahasa",
    description:
      "Minahasa Eagles adalah klub voli yang mewakili kabupaten Minahasa. Dengan basis penggemar yang luas di seluruh kabupaten, klub ini dikenal dengan gaya permainan yang agresif dan atraktif.",
    foundedYear: 2008,
    logo: "/placeholder-logo.png",
  },
  {
    id: "4",
    name: "Bitung Sharks",
    slug: "bitung-sharks",
    location: "Bitung, Sulawesi Utara",
    description:
      "Bitung Sharks adalah klub voli yang berbasis di kota pelabuhan Bitung. Didukung oleh komunitas maritim yang kuat, klub ini memiliki filosofi permainan yang tangguh dan pantang menyerah.",
    foundedYear: 2015,
    logo: "/placeholder-logo.png",
  },
  {
    id: "5",
    name: "Kotamobagu Smashers",
    slug: "kotamobagu-smashers",
    location: "Kotamobagu, Sulawesi Utara",
    description:
      "Kotamobagu Smashers adalah klub voli yang mewakili kota Kotamobagu. Meskipun tergolong baru, klub ini telah menunjukkan perkembangan pesat dan menjadi kekuatan baru dalam kancah voli Sulawesi Utara.",
    foundedYear: 2018,
    logo: "/placeholder-logo.png",
  },
  {
    id: "6",
    name: "Sangihe Islanders",
    slug: "sangihe-islanders",
    location: "Tahuna, Kepulauan Sangihe",
    description:
      "Sangihe Islanders adalah klub voli yang mewakili Kepulauan Sangihe. Dengan pemain-pemain yang berasal dari berbagai pulau di kepulauan Sangihe, klub ini membawa keunikan budaya dalam permainan voli mereka.",
    foundedYear: 2014,
    logo: "/placeholder-logo.png",
  },
]
