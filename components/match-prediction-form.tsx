"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

// Assuming submitPrediction is a server action defined elsewhere
// You will need to import this from your server actions file, e.g.,
// import { submitPrediction } from "@/app/actions";
// For now, let's define a placeholder to avoid compilation errors
// The action now only needs the formData
async function submitPrediction(formData: FormData): Promise<{ success: boolean; message: string }> {
  // This is a placeholder. Replace with your actual server action logic.
  console.log("Server action placeholder received:", formData);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Prediction submitted successfully (simulated)." };
}

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
  const [predictedWinner, setPredictedWinner] = useState<string | null>(null)
  const [predictedHomeScore, setPredictedHomeScore] = useState<number>(0)
  const [predictedAwayScore, setPredictedAwayScore] = useState<number>(0)

  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitPrediction(formData);
      setState(result);
    });
  };

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