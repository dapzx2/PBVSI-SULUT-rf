"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { submitPrediction } from "@/lib/predictions"

interface MatchPredictionFormProps {
  matchId: string
  homeTeamName: string
  awayTeamName: string
  homeTeamId: string
  awayTeamId: string
}

export function MatchPredictionForm({
  matchId,
  homeTeamName,
  awayTeamName,
  homeTeamId,
  awayTeamId,
}: MatchPredictionFormProps) {
  const [state, formAction, isPending] = useActionState(submitPrediction, null)
  const [predictedWinner, setPredictedWinner] = useState<string | null>(null)
  const [predictedHomeScore, setPredictedHomeScore] = useState<number>(0)
  const [predictedAwayScore, setPredictedAwayScore] = useState<number>(0)

  const handleSubmit = async (formData: FormData) => {
    if (!predictedWinner) {
      alert("Mohon pilih tim pemenang.")
      return
    }
    if (predictedHomeScore < 0 || predictedAwayScore < 0) {
      alert("Skor tidak boleh negatif.")
      return
    }

    // Call the server action with the collected data
    await formAction(matchId, predictedWinner, predictedHomeScore, predictedAwayScore)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediksi Pertandingan</CardTitle>
        <CardDescription>Pilih tim pemenang dan masukkan skor prediksi Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="winner">Tim Pemenang</Label>
              <RadioGroup
                id="winner"
                name="predictedWinnerTeamId"
                onValueChange={setPredictedWinner}
                value={predictedWinner || ""}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={homeTeamId} id="home-team" />
                  <Label htmlFor="home-team">{homeTeamName}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={awayTeamId} id="away-team" />
                  <Label htmlFor="away-team">{awayTeamName}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="home-score">{homeTeamName} Skor</Label>
                <Input
                  id="home-score"
                  name="predictedScoreHome"
                  type="number"
                  min="0"
                  value={predictedHomeScore}
                  onChange={(e) => setPredictedHomeScore(Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="away-score">{awayTeamName} Skor</Label>
                <Input
                  id="away-score"
                  name="predictedScoreAway"
                  type="number"
                  min="0"
                  value={predictedAwayScore}
                  onChange={(e) => setPredictedAwayScore(Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim Prediksi...
              </>
            ) : (
              "Kirim Prediksi"
            )}
          </Button>

          {state && (
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{state.success ? "Berhasil!" : "Gagal!"}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}