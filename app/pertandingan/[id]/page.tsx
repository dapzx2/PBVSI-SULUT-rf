import { getMatchDetails } from "@/lib/matches"
import { notFound } from "next/navigation"
import { Metadata } from "next"
// import { PageTransition } from "@/components/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MatchDetailPageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: MatchDetailPageProps): Promise<Metadata> {
    const { match } = await getMatchDetails(params.id)

    if (!match) {
        return {
            title: 'Pertandingan Tidak Ditemukan',
        }
    }

    return {
        title: `${match.home_team?.name} vs ${match.away_team?.name} - PBVSI Sulut`,
        description: `Detail pertandingan antara ${match.home_team?.name} melawan ${match.away_team?.name}`,
    }
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
    const { match, error } = await getMatchDetails(params.id)

    if (error || !match) {
        notFound()
    }

    const homeSets = match.score_home_sets || 0
    const awaySets = match.score_away_sets || 0

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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-32">
            {/* <PageTransition> */}
            <div className="container mx-auto px-4 py-8">
                <Link href="/pertandingan">
                    <Button variant="ghost" className="mb-6 hover:bg-orange-50 hover:text-orange-600">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Pertandingan
                    </Button>
                </Link>

                <Card className="overflow-hidden border-orange-200 shadow-lg bg-white">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 md:p-6 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-sm md:text-lg px-3 md:px-4 py-1">
                                    {match.league}
                                </Badge>
                                {match.status.toLowerCase() === "live" && (
                                    <Badge className="bg-red-500 text-white animate-pulse border-none text-sm md:text-lg px-3 md:px-4 py-1">
                                        LIVE
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-orange-100 bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base">
                                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="font-medium">{formatDate(match.match_date)}</span>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-4 md:p-8">
                        {/* Score Board */}
                        <div className="grid grid-cols-3 md:flex md:flex-row items-center justify-between gap-2 md:gap-8 mb-6 md:mb-12">
                            {/* Home Team */}
                            <div className="flex flex-col items-center justify-start h-full">
                                {match.home_team?.logo_url ? (
                                    <div className="w-16 h-16 md:w-32 md:h-32 mb-2 md:mb-4 bg-white rounded-full p-2 md:p-4 shadow-lg border-2 md:border-4 border-orange-100">
                                        <Image
                                            src={match.home_team.logo_url}
                                            alt={match.home_team?.name || "Home Team"}
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 md:w-32 md:h-32 mb-2 md:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl md:text-4xl font-bold text-gray-400">H</span>
                                    </div>
                                )}
                                <h2 className={cn(
                                    "text-sm md:text-3xl font-bold text-center mb-1 md:mb-2 leading-tight",
                                    getScoreClass("home", homeSets, awaySets)
                                )}>
                                    {match.home_team?.name}
                                </h2>
                                <p className="hidden md:block text-gray-500 font-medium">Tim Tuan Rumah</p>
                            </div>

                            {/* VS / Score */}
                            <div className="flex flex-col items-center justify-center h-full">
                                {match.status.toLowerCase() === "scheduled" || match.status.toLowerCase() === "upcoming" ? (
                                    <div className="text-2xl md:text-6xl font-black text-gray-200">VS</div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 md:gap-6 mb-1 md:mb-4">
                                            <span className={cn(
                                                "text-3xl md:text-8xl font-black",
                                                getScoreClass("home", homeSets, awaySets)
                                            )}>
                                                {homeSets}
                                            </span>
                                            <span className="text-xl md:text-4xl text-gray-300 font-light">-</span>
                                            <span className={cn(
                                                "text-3xl md:text-8xl font-black",
                                                getScoreClass("away", homeSets, awaySets)
                                            )}>
                                                {awaySets}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="text-gray-500 border-gray-300 px-2 py-0.5 md:px-4 md:py-1 text-[10px] md:text-sm whitespace-nowrap">
                                            Total Set
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col items-center justify-start h-full">
                                {match.away_team?.logo_url ? (
                                    <div className="w-16 h-16 md:w-32 md:h-32 mb-2 md:mb-4 bg-white rounded-full p-2 md:p-4 shadow-lg border-2 md:border-4 border-red-100">
                                        <Image
                                            src={match.away_team.logo_url}
                                            alt={match.away_team?.name || "Away Team"}
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 md:w-32 md:h-32 mb-2 md:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl md:text-4xl font-bold text-gray-400">A</span>
                                    </div>
                                )}
                                <h2 className={cn(
                                    "text-sm md:text-3xl font-bold text-center mb-1 md:mb-2 leading-tight",
                                    getScoreClass("away", homeSets, awaySets)
                                )}>
                                    {match.away_team?.name}
                                </h2>
                                <p className="hidden md:block text-gray-500 font-medium">Tim Tamu</p>
                            </div>
                        </div>

                        {/* Set Details */}
                        {(match.status.toLowerCase() !== "scheduled" && match.status.toLowerCase() !== "upcoming") && (
                            <div className="max-w-3xl mx-auto mb-8 md:mb-12">
                                <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
                                    <h3 className="text-base md:text-lg font-semibold text-center mb-4 md:mb-6 text-gray-700">Detail Perolehan Poin per Set</h3>
                                    <div className="grid grid-cols-5 gap-2 md:gap-4">
                                        {Array.isArray(match.score_home_points) && Array.isArray(match.score_away_points) ? (
                                            match.score_home_points.map((homeScore, index) => {
                                                const awayScore = match.score_away_points![index]
                                                const homeWon = homeScore > awayScore
                                                const awayWon = awayScore > homeScore

                                                return (
                                                    <div key={index} className="flex flex-col items-center">
                                                        <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 md:mb-2">Set {index + 1}</div>
                                                        <div className={cn(
                                                            "flex flex-col items-center justify-center w-full aspect-square rounded-lg md:rounded-xl border-2 transition-all p-1",
                                                            homeWon && "bg-orange-50 border-orange-200 shadow-sm",
                                                            awayWon && "bg-red-50 border-red-200 shadow-sm",
                                                            !homeWon && !awayWon && "bg-white border-gray-100"
                                                        )}>
                                                            <span className={cn("text-sm md:text-xl font-bold", homeWon ? "text-orange-600" : "text-gray-400")}>
                                                                {homeScore}
                                                            </span>
                                                            <div className="w-4 md:w-8 h-px bg-gray-200 my-0.5 md:my-1"></div>
                                                            <span className={cn("text-sm md:text-xl font-bold", awayWon ? "text-red-600" : "text-gray-400")}>
                                                                {awayScore}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="col-span-full text-center text-gray-500 italic">
                                                Detail skor per set belum tersedia
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Match Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm text-blue-600 font-medium mb-0.5 md:mb-1">Lokasi Pertandingan</p>
                                    <p className="text-sm md:text-base text-gray-900 font-semibold">{match.venue}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                    <Trophy className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm text-purple-600 font-medium mb-0.5 md:mb-1">Status Pertandingan</p>
                                    <p className="text-sm md:text-base text-gray-900 font-semibold capitalize">{match.status}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* </PageTransition> */}
        </div>
    )
}
