import Image from "next/image"
import { Loader2, RefreshCw, WifiOff, MapPin, Calendar, Trophy, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StickyHeader } from "@/components/sticky-header"
import { PageTransition } from "@/components/page-transition"
import { getClubBySlug } from "@/lib/clubs"
import { getPlayers } from "@/lib/players"
import type { Club, Player } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default async function ClubDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  let club: Club | null = null
  let players: Player[] = []
  let error: string | null = null

  try {
    const { club: fetchedClub, error: clubError } = await getClubBySlug(slug)
    if (clubError) {
      throw new Error(clubError)
    }
    if (!fetchedClub) {
      error = "Klub tidak ditemukan."
    } else {
      club = fetchedClub

      const { players: fetchedPlayers, error: playersError } = await getPlayers()
      if (playersError) {
        throw new Error(playersError)
      }
      // Filter players belonging to this club
      players = fetchedPlayers?.filter((player) => player.club_id === fetchedClub.id) || []
    }
  } catch (err: any) {
    console.error("Error fetching club data:", err)
    error = err.message || "Terjadi kesalahan saat memuat detail klub."
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="klub" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <div className="text-6xl mb-4">
              <WifiOff className="h-16 w-16 mx-auto text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            {/* No direct retry button for server components, user can refresh page */}
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!club) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <StickyHeader currentPage="klub" />
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Klub Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Maaf, klub yang Anda cari tidak ada.</p>
            <Link href="/klub">
              <Button>Kembali ke Daftar Klub</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <StickyHeader currentPage="klub" />

        {/* Club Header Section */}
        <div className="relative bg-gradient-to-br from-white to-gray-50 border-b shadow-sm pt-16 pb-8 md:pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                <Image
                  src={club.logo_url || "/placeholder.svg?height=192&width=192&query=club logo"}
                  alt={`${club.name} logo`}
                  width={192}
                  height={192}
                  className="object-contain p-2"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">{club.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-gray-600 text-lg mb-4">
                  <span className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                    {club.city}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                    Berdiri: {club.established_year}
                  </span>
                  {club.coach && (
                    <span className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-orange-500" />
                      Pelatih: {club.coach}
                    </span>
                  )}
                </div>
                {club.achievements && (
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-4">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    {club.achievements.split(',').map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                        {achievement.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Club Description */}
        {club.description && (
          <div className="container mx-auto px-4 py-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang {club.name}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{club.description}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Players Section */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pemain {club.name}</h2>
          {players.length === 0 ? (
            <div className="text-center text-gray-600 text-lg mt-10">
              <p>Belum ada data pemain untuk klub ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players.map((player) => (
                <Card
                  key={player.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {player.photo_url && (
                    <Image
                      src={player.photo_url || "/placeholder.svg?height=200&width=300&query=player photo"}
                      alt={player.name}
                      width={300}
                      height={200}
                      className="object-cover"
                    />
                  )}
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-1">{player.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Posisi: {player.position}</p>
                    <p className="text-sm text-gray-600">Tinggi: {player.height} cm</p>
                    <p className="text-sm text-gray-600">Berat: {player.weight} kg</p>
                    <Link href={`/pemain/${player.id}`} passHref>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        Lihat Detail
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </PageTransition>
  )
}