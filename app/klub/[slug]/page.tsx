import Image from "next/image"
import { WifiOff, MapPin, Calendar, Trophy, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/page-transition"
import { getClubBySlug } from "@/lib/clubs"
import { getPlayers } from "@/lib/players"
import type { Club, Player } from "@/lib/types"
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
          <div className="container mx-auto px-4 py-16 pt-32 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Klub Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Maaf, klub yang Anda cari tidak ada.</p>
            <Link href="/klub">
              <Button>
                Kembali ke Daftar Klub
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Club Header Section */}
        <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-200 shadow-md pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-6 border-white shadow-xl bg-gray-100 flex items-center justify-center p-2">
                <Image
                  src={club.logo_url || "/placeholder.svg?height=192&width=192&query=club logo"}
                  alt={`${club.name} logo`}
                  width={224}
                  height={224}
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-6xl font-extrabold text-orange-900 mb-3 leading-tight">{club.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-3 text-orange-800 text-lg mb-5">
                  <span className="flex items-center font-medium">
                    <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                    {club.city}
                  </span>
                  <span className="flex items-center font-medium">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    Berdiri: {club.established_year}
                  </span>
                  {club.coach && (
                    <span className="flex items-center font-medium">
                      <User className="w-5 h-5 mr-2 text-orange-600" />
                      Pelatih: {club.coach}
                    </span>
                  )}
                </div>
                {club.achievements && (
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-6">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    {club.achievements.split(',').map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-200 text-orange-800 text-base px-4 py-1.5 rounded-full font-semibold shadow-sm">
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
            <div className="text-center text-gray-600 text-lg mt-10 p-8 bg-white rounded-lg shadow-sm">
              <p>Belum ada data pemain untuk klub ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players.map((player) => (
                <Card
                  key={player.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {player.photo_url && (
                    <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                      <Image
                        src={player.photo_url || "/placeholder.svg?height=200&width=300&query=player photo"}
                        alt={player.name}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{player.name}</h3>
                    <p className="text-sm text-gray-700 mb-1">Posisi: <span className="font-semibold">{player.position}</span></p>
                    <p className="text-sm text-gray-700 mb-1">Tinggi: <span className="font-semibold">{player.height} cm</span></p>
                    <p className="text-sm text-gray-700 mb-3">Berat: <span className="font-semibold">{player.weight} kg</span></p>
                    <Link href={`/pemain/${player.id}`} className="mt-auto">
                      <Button variant="outline" className="w-full bg-orange-50 text-orange-600 border-orange-300 hover:bg-orange-100">
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
