"use client"

import { useEffect } from "react"

export function ScrollbarWidthCalculator() {
    useEffect(() => {
        const setScrollbarWidth = () => {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`)
        }

        // Set initially
        setScrollbarWidth()

        // Update on resize (zoom can change scrollbar width)
        window.addEventListener("resize", setScrollbarWidth)

        return () => window.removeEventListener("resize", setScrollbarWidth)
    }, [])

    return null
}
