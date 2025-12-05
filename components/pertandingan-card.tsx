import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, MapPin, Trophy } from "lucide-react"
import type { Match as Pertandingan } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface PertandinganCardProps {
  match: Pertandingan
}

export function PertandinganCard({ match }: PertandinganCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5 font-medium px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </Badge>
        )
      case "finished":
        return (
          <Badge variant="secondary" className="bg-gray-200 text-gray-700 px-3 py-1">
            Selesai
          </Badge>
        )
      case "scheduled":
      case "upcoming":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">
            Akan Datang
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    const day = date.getDate()
    const month = months[date.getMonth()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${day} ${month} ${hours}:${minutes}:${seconds} WITA`
  }

  const getScoreClass = (team: "home" | "away", homeSets: number, awaySets: number) => {
    if (match.status.toLowerCase() === "scheduled" || match.status.toLowerCase() === "upcoming")
      return "text-gray-900"

    if (team === "home" && homeSets > awaySets) {
      return "text-orange-600 font-bold"
    } else if (team === "away" && awaySets > homeSets) {
      return "text-orange-600 font-bold"
    }
    return "text-gray-700"
  }

  const homeSets = match.score_home_sets || 0;
  const awaySets = match.score_away_sets || 0;

  return (
    <Link href={`/pertandingan/${match.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-orange-300 group-hover:scale-[1.02] bg-white">
        <CardContent className="p-0">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 border-b border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-sm">
                  {match.league}
                </Badge>
                {getStatusBadge(match.status)}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-orange-600" />
                {formatDate(match.match_date)}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Teams Display */}
            <div className="flex items-center justify-between mb-4">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                {match.home_team?.logo_url && (
                  <div className="w-16 h-16 mb-3 bg-white rounded-full p-2 shadow-md border-2 border-orange-200">
                    <Image
                      src={match.home_team.logo_url}
                      alt={match.home_team?.name || "Team"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
                <p className={cn(
                  "font-bold text-center text-base",
                  getScoreClass("home", homeSets, awaySets)
                )}>
                  {match.home_team?.name}
                </p>
              </div>

              {/* Score / VS */}
              <div className="flex flex-col items-center px-6">
                {match.status.toLowerCase() === "scheduled" || match.status.toLowerCase() === "upcoming" ? (
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        "text-4xl font-extrabold",
                        getScoreClass("home", homeSets, awaySets)
                      )}>
                        {homeSets}
                      </span>
                      <span className="text-2xl text-gray-400">-</span>
                      <span className={cn(
                        "text-4xl font-extrabold",
                        getScoreClass("away", homeSets, awaySets)
                      )}>
                        {awaySets}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Trophy className="h-3 w-3" />
                      <span>Set Wins</span>
                    </div>
                  </>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                {match.away_team?.logo_url && (
                  <div className="w-16 h-16 mb-3 bg-white rounded-full p-2 shadow-md border-2 border-red-200">
                    <Image
                      src={match.away_team.logo_url}
                      alt={match.away_team?.name || "Team"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
                <p className={cn(
                  "font-bold text-center text-base",
                  getScoreClass("away", homeSets, awaySets)
                )}>
                  {match.away_team?.name}
                </p>
              </div>
            </div>

            {/* Set Scores */}
            {match.status.toLowerCase() !== "scheduled" &&
              match.status.toLowerCase() !== "upcoming" &&
              match.score_home_points &&
              match.score_away_points && (
                <div className="flex justify-center gap-3 mb-4">
                  {Array.isArray(match.score_home_points) && Array.isArray(match.score_away_points) ? (
                    match.score_home_points.map((homeScore, index) => {
                      const awayScore = match.score_away_points![index];
                      const homeWon = homeScore > awayScore;
                      const awayWon = awayScore > homeScore;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "px-3 py-2 rounded-lg border-2 min-w-[60px]",
                            homeWon && "bg-orange-50 border-orange-300",
                            awayWon && "bg-red-50 border-red-300",
                            !homeWon && !awayWon && "bg-gray-50 border-gray-200"
                          )}
                        >
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Set {index + 1}</div>
                            <div className="flex items-center justify-center gap-1 text-sm font-bold">
                              <span className={homeWon ? "text-orange-700" : "text-gray-600"}>
                                {homeScore}
                              </span>
                              <span className="text-gray-400">:</span>
                              <span className={awayWon ? "text-red-700" : "text-gray-600"}>
                                {awayScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">Skor tidak tersedia</span>
                  )}
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span className="font-medium">{match.venue}</span>
            </div>
            {match.status.toLowerCase() === "live" && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                Set {(match.score_home_points as number[] || []).length + 1}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
