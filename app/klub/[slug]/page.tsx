import Image from "next/image"
import { WifiOff, MapPin, Calendar, Trophy, User, ArrowLeft } from 'lucide-react'
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
      <div className="min-h-screen bg-[#FDFDFD] pb-20">
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10 h-[500px] w-full bg-gradient-to-b from-orange-50/50 to-transparent" />

        <div className="container mx-auto px-4 pt-24 md:pt-32">
          {/* Back Button */}
          <Link href="/klub" className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors mb-8 group">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 group-hover:border-orange-200 group-hover:bg-orange-50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Kembali ke Daftar Klub</span>
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Logo & Key Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div
                className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center"
              >
                <div className="relative w-32 h-32 md:w-48 md:h-48">
                  <Image
                    src={club.logo_url || "/placeholder.svg?height=192&width=192&query=club logo"}
                    alt={`${club.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Kota Asal</p>
                    <p className="text-lg font-bold text-gray-900">{club.city}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Tahun Berdiri</p>
                    <p className="text-lg font-bold text-gray-900">{club.established_year || '-'}</p>
                  </div>
                </div>

                {club.coach && (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Pelatih</p>
                      <p className="text-lg font-bold text-gray-900">{club.coach}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Info & Details */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{club.name}</h1>

                {club.achievements && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {club.achievements.split(',').map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1 text-sm flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {achievement.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {club.description && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Klub</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{club.description}</p>
                  </div>
                </div>
              )}

              {/* Players Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Pemain</h2>
                {players.length === 0 ? (
                  <div className="text-center text-gray-600 text-lg p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <p>Belum ada data pemain untuk klub ini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.map((player) => (
                      <Link href={`/pemain/${player.id}`} key={player.id} className="group">
                        <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-gray-100 h-full">
                          <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                            <Image
                              src={player.photo_url || "/placeholder.svg?height=200&width=300&query=player photo"}
                              alt={player.name}
                              width={300}
                              height={200}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">{player.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{player.position}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{player.height} cm</span>
                              <span>{player.weight} kg</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
