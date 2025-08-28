"use client"

import { useState, useEffect } from "react"
import { getPertandinganLangsung } from "@/lib/pertandingan"
import type { Match } from "@/lib/types"

export function usePertandingan() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)
        const { matches: pertandinganLangsung, error: fetchError } = await getPertandinganLangsung()
        if (fetchError) {
          throw new Error(fetchError);
        }
        setMatches(pertandinganLangsung || [])
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