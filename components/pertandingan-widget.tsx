"use client"

import { usePertandingan } from "@/hooks/use-pertandingan"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export function PertandinganWidget() {
  const { matches, loading, error } = usePertandingan()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            Pertandingan Langsung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skor Langsung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">Kesalahan: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skor Langsung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Tidak ada pertandingan langsung saat ini</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          Pertandingan Langsung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  LIVE
                </Badge>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {match.venue}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{match.home_team?.name}</div>
                </div>

                <div className="px-3 py-1 bg-gray-100 rounded text-center min-w-[60px]">
                  <div className="font-bold">
                    {match.score_home_sets} - {match.score_away_sets}
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className="font-medium text-sm">{match.away_team?.name}</div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500 text-center">
                Set {match.score_home_points && match.score_away_points ? (match.score_home_points as number[]).length + 1 : 'N/A'} • {match.league}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}