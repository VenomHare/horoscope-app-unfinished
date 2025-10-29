"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import HoraCard from "./hora-card"
import LoadingSpinner from "./loading-spinner"
import TimePicker from "./time-picker"

interface HoraData {
  time: string
  day: string
  hora: string
  endTime: string
}

export default function HoraDisplay() {
  const { t } = useLanguage()
  const [horaData, setHoraData] = useState<HoraData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState(new Date())
  function toLocalISOString(date = new Date()) {
    const tzOffset = -date.getTimezoneOffset(); // in minutes
    const diffMs = tzOffset * 60 * 1000;
    const local = new Date(date.getTime() + diffMs);
    const iso = local.toISOString().slice(0, -1); // remove trailing 'Z'

    // Format timezone offset as +05:30 or -04:00
    const sign = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
    const hours = pad(tzOffset / 60);
    const minutes = pad(tzOffset % 60);

    return `${iso}`;
  }

  const fetchHora = async (dateTime: Date) => {
    try {
      setLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat =  pos.coords.latitude;
          const lng = pos.coords.longitude;

          const response = await fetch("/api/getHora", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ time: toLocalISOString(dateTime), lng, lat }),
          })

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
          }

          const data = await response.json()
          if (!data || !data.hora) {
            throw new Error("Invalid response from server")
          }
          setHoraData(data)
          setError(null)
        },
        (err) => {
          console.error("Error getting location:", err);
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch hora data"
      setError(errorMessage)
      setHoraData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const now = new Date();
    setSelectedTime(now)
    fetchHora(now)
  }, [])

  const handleTimeSelect = (newTime: Date) => {
    setSelectedTime(newTime)
    fetchHora(newTime)
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 animate-pulse">
          {t("title")}
        </h1>
        <p className="text-purple-300 text-lg">{t("subtitle")}</p>
      </div>

      <div className="flex justify-center mb-8">
        <TimePicker onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center backdrop-blur-sm">
          <p className="text-red-300 font-semibold mb-2">{t("error")}: Connection Issue</p>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <p className="text-red-200/70 text-xs">
            {t("tryAgain") || "Make sure the server is running at http://localhost:3000"}
          </p>
          <button
            onClick={() => handleTimeSelect(selectedTime)}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
          >
            {t("retry") || "Retry"}
          </button>
        </div>
      )}

      {!loading && !error && horaData && <HoraCard horaData={horaData} />}

      {!loading && !error && !horaData && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6 text-center backdrop-blur-sm">
          <p className="text-yellow-300">{t("noData")}</p>
        </div>
      )}

      {!loading && !error && horaData && (
        <div className="mt-12 text-center text-sm text-purple-400">
          <p>
            {t("lastUpdated")}: {selectedTime.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  )
}
