import { getMatchDetails } from "@/lib/matches"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  MapPin,
  ArrowLeft,
  VibrateIcon as Volleyball,
  Users,
  Zap,
  Shield,
  RefreshCw,
  Timer,
  MessageSquare,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MatchEvent, Prediction } from "@/lib/types"
import { MatchPredictionForm } from "@/components/match-prediction-form" // Import the new component

interface MatchDetailPageProps {
  params: {
    id: string
  }
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { match, error: matchError } = await getMatchDetails(params.id)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const predictionsResponse = await fetch(`${baseUrl}/api/predictions?matchId=${params.id}`);
  let predictions: Prediction[] | null = null;
  let predictionsError: string | null = null;

  if (predictionsResponse.ok) {
    const data = await predictionsResponse.json();
    predictions = data.predictions;
  } else {
    const errorData = await predictionsResponse.json();
    predictionsError = errorData.message || 'Failed to fetch predictions';
  }

  if (matchError || !match) {
    notFound()
  }

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
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreClass = (team: "home" | "away", homeSetsWon: number, awaySetsWon: number) => {
    if (match.status === "upcoming") return "text-gray-900"

    if (team === "home" && homeSetsWon > awaySetsWon) {
      return "text-orange-600 font-bold"
    } else if (team === "away" && awaySetsWon > homeSetsWon) {
      return "text-orange-600 font-bold"
    }
    return "text-gray-900"
  }

  // Assuming match.score_home_points and match.score_away_points are JSON arrays of numbers
  const homeSetsWon = match.score_home_points ? (match.score_home_points as number[]).filter((score, index) => score > (match.score_away_points as number[])[index]).length : 0;
  const awaySetsWon = match.score_away_points ? (match.score_away_points as number[]).filter((score, index) => score > (match.score_home_points as number[])[index]).length : 0;

  const getEventIcon = (type: MatchEvent["type"]) => {
    switch (type) {
      case "point":
        return <Volleyball className="h-4 w-4 text-green-500" />
      case "substitution":
        return <Users className="h-4 w-4 text-blue-500" />
      case "timeout":
        return <Timer className="h-4 w-4 text-yellow-500" />
      case "card":
        return <Shield className="h-4 w-4 text-red-500" />
      case "block":
        return <Zap className="h-4 w-4 text-purple-500" />
      case "ace":
        return <Volleyball className="h-4 w-4 text-orange-500" />
      case "error":
        return <MessageSquare className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/live-score" passHref>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Live Skor
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  {match.league}
                </Badge>
                {getStatusBadge(match.status)}
              </div>
              {match.status === "live" && match.score_home_sets && match.score_away_sets && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-sm">
                  Set {match.score_home_points && match.score_away_points ? (match.score_home_points as number[]).length + 1 : 'N/A'}
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              <div className="flex items-center justify-center gap-4">
                {match.home_team?.logo_url && (
                  <Image
                    src={match.home_team.logo_url || "/placeholder.svg"}
                    alt={`${match.home_team.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <span className={cn(getScoreClass("home", homeSetsWon, awaySetsWon))}>{match.home_team?.name}</span>
                <span className="text-gray-400 text-xl mx-2">vs</span>
                <span className={cn(getScoreClass("away", homeSetsWon, awaySetsWon))}>{match.away_team?.name}</span>
                {match.away_team?.logo_url && (
                  <Image
                    src={match.away_team.logo_url || "/placeholder.svg"}
                    alt={`${match.away_team.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(match.match_date)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <MapPin className="h-4 w-4" />
              <span>{match.venue}</span>
            </div>

            {match.status !== "upcoming" && (
              <>
                <div className="flex items-center justify-center gap-4 text-4xl font-extrabold mb-4">
                  <span className={cn(getScoreClass("home", homeSetsWon, awaySetsWon))}>{homeSetsWon}</span>
                  <span className="text-gray-400">-</span>
                  <span className={cn(getScoreClass("away", homeSetsWon, awaySetsWon))}>{awaySetsWon}</span>
                </div>
                <div className="flex justify-center gap-4 text-lg text-gray-700 mb-6">
                  {match.score_home_points && match.score_away_points && (
                    (match.score_home_points as number[]).map((homeScore, index) => {
                      const awayScore = (match.score_away_points as number[])[index];
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <span className="text-sm text-gray-500">Set {index + 1}</span>
                          <span className="font-medium">
                            <span className={cn(homeScore > awayScore ? "font-bold text-gray-900" : "")}>{homeScore}</span>
                            <span>:</span>
                            <span className={cn(awayScore > homeScore ? "font-bold text-gray-900" : "")}>{awayScore}</span>
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {match.status === "upcoming" && (
          <div className="mb-8">
            <MatchPredictionForm
              matchId={match.id}
              homeTeamName={match.home_team?.name || ''}
              awayTeamName={match.away_team?.name || ''}
              homeTeamId={match.home_team_id}
              awayTeamId={match.away_team_id}
            />
          </div>
        )}

        {predictions && predictions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Prediksi Pengguna</CardTitle>
              <CardDescription>Lihat prediksi dari pengguna lain.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction: Prediction) => (
                  <div key={prediction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-800">Pengguna {prediction.user_id?.split("-")[1]}</span>{" "}
                      {/* Simple user display */}
                    </div>
                    <div className="text-sm text-gray-700">
                      Prediksi:{" "}
                      <span className="font-semibold">
                        {prediction.predicted_winner_id === match.home_team_id ? match.home_team?.name : match.away_team?.name} (
                        {prediction.predicted_score_home_sets} - {prediction.predicted_score_away_sets})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(prediction.prediction_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {match.events && match.events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Jalannya Pertandingan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-gray-200">
                {match.events.map((event, index) => (
                  <div key={event.id} className="mb-6 last:mb-0 flex items-start">
                    <div className="absolute -left-3 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-200">
                      {/* Assuming event.type is a string that maps to an icon */}
                      {/* You'll need to define getEventIcon based on your MatchEvent type */}
                      {/* For now, using a placeholder icon */}
                      <Volleyball className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {new Date(event.timestamp).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {event.score_home && event.score_away && (
                          <Badge variant="secondary" className="text-xs">
                            {event.score_home} - {event.score_away} (Set {event.set_number})
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700">{event.description}</p>
                      {event.player_id && <p className="text-xs text-gray-500 mt-1">Pemain ID: {event.player_id}</p>}
                      {event.team_id && <p className="text-xs text-gray-500 mt-1">Tim ID: {event.team_id}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(!match.events || match.events.length === 0) && match.status !== "upcoming" && (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <RefreshCw className="h-12 w-12 mx-auto mb-4" />
              <p>Belum ada detail jalannya pertandingan tersedia untuk saat ini.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}