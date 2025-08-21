"use client"

import { useState, useEffect } from "react"
import { getLiveMatches } from "@/lib/live-scores"
import type { Match } from "@/lib/types"

export function useLiveScores() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)
        const { matches: liveMatches, error: fetchError } = await getLiveMatches()
        if (fetchError) {
          throw new Error(fetchError);
        }
        setMatches(liveMatches || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch matches")
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()

    // Polling for updates (e.g., every 10 seconds)
    const intervalId = setInterval(fetchMatches, 10000); 

    return () => {
      clearInterval(intervalId);
    }
  }, [])

  return { matches, loading, error }
}