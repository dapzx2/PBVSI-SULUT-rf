import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, MapPin } from "lucide-react"
import type { Match as LiveScore } from "@/lib/types"
import Image from "next/image"
import Link from "next/link" // Import Link

interface LiveScoreCardProps {
  match: LiveScore
  delay?: number
}

export function LiveScoreCard({ match, delay = 0 }: LiveScoreCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200 flex items-center gap-1.5 font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            LIVE
          </Badge>
        )
      case "finished":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Selesai
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Akan Datang
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreClass = (team: "home" | "away", homeSets: number, awaySets: number) => {
    if (match.status === "upcoming") return "text-gray-900"

    if (team === "home" && homeSets > awaySets) {
      return "text-orange-600 font-bold"
    } else if (team === "away" && awaySets > homeSets) {
      return "text-orange-600 font-bold"
    }
    return "text-gray-900"
  }

  const homeSets = match.score_home_sets || 0;
  const awaySets = match.score_away_sets || 0;

  return (
    <Link href={`/live-score/${match.id}`} className="block">
      {" "}
      {/* Wrap with Link */}
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  {match.league}
                </Badge>
                {getStatusBadge(match.status)}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(match.match_date)}
              </div>
            </div>

            {/* Teams and Scores */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3">
              {/* Home Team */}
              <div className="flex items-center gap-2">
                {match.home_team?.logo_url && (
                  <Image
                    src={match.home_team.logo_url || "/placeholder.svg"}
                    alt={`${match.home_team.name} logo`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <p className={cn("font-semibold text-lg", getScoreClass("home", homeSets, awaySets))}>
                  {match.home_team?.name}
                </p>
              </div>

              {/* Total Sets Score */}
              <div className="px-2 py-1 bg-gray-50 rounded-lg flex items-center justify-center min-w-[60px]">
                {match.status === "upcoming" ? (
                  <span className="text-sm text-gray-500">VS</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className={cn("text-xl font-bold", getScoreClass("home", homeSets, awaySets))}>
                      {homeSets}
                    </span>
                    <span className="text-gray-400 mx-0.5">-</span>
                    <span className={cn("text-xl font-bold", getScoreClass("away", homeSets, awaySets))}>
                      {awaySets}
                    </span>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-end gap-2 text-right">
                <p className={cn("font-semibold text-lg", getScoreClass("away", homeSets, awaySets))}>
                  {match.away_team?.name}
                </p>
                {match.away_team?.logo_url && (
                  <Image
                    src={match.away_team.logo_url || "/placeholder.svg"}
                    alt={`${match.away_team.name} logo`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>

            {/* Individual Set Scores */}
            {match.status !== "upcoming" && match.score_home_points && match.score_away_points && (
              <div className="flex justify-end gap-2 text-sm text-gray-600 mb-3">
                {(match.score_home_points as number[]).map((homeScore, index) => {
                  const awayScore = (match.score_away_points as number[])[index];
                  return (
                    <span key={index} className="flex gap-0.5">
                      <span className={cn(homeScore > awayScore ? "font-bold text-gray-900" : "")}>{homeScore}</span>
                      <span>:</span>
                      <span className={cn(awayScore > homeScore ? "font-bold text-gray-900" : "")}>{awayScore}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{match.venue}</span>
              </div>
              {match.status === "live" && match.score_home_sets && match.score_away_sets && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                  Set {match.score_home_sets + match.score_away_sets + 1}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}