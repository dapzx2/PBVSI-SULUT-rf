"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Gender = "men" | "women"

interface ThemeContextType {
  gender: Gender
  setGender: (gender: Gender) => void
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [gender, setGender] = useState<Gender>("men")

  // Persist gender preference
  useEffect(() => {
    const savedGender = localStorage.getItem("volleyball-gender") as Gender
    if (savedGender && (savedGender === "men" || savedGender === "women")) {
      setGender(savedGender)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("volleyball-gender", gender)
  }, [gender])

  // Always use orange theme regardless of gender
  const colors = {
    primary: "#ea580c", // orange-600
    secondary: "#fed7aa", // orange-200
    accent: "#fb923c", // orange-400
  }

  return <ThemeContext.Provider value={{ gender, setGender, colors }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
