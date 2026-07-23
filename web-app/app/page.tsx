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
    <main className="relative min-h-screen overflow-hidden bg-[#F7EFE1] text-[#281B10]">
      <CelestialBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-6 md:py-10">
        <div className="w-full max-w-6xl">
          <LanguageSwitcher />
        </div>
        <HoraDisplay />
        <HoraTable />
      </div>
    </main>
  )
}
