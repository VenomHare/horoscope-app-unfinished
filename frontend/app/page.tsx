"use client"

import { useState, useEffect } from "react"
import HoraDisplay from "@/components/hora-display"
import LanguageSwitcher from "@/components/language-switcher"
import CelestialBackground from "@/components/celestial-background"
import HoraTable from "@/components/hora-table"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-purple-950 to-slate-950">
      <CelestialBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        <HoraDisplay />
        <HoraTable />
      </div>
    </main>
  )
}
