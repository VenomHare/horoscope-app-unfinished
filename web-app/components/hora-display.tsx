"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"
import HoraCard from "./hora-card"
import LoadingSpinner from "./loading-spinner"
import TimePicker from "./time-picker"
import { getCurrentHora } from "@/lib/hora-detector"

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

    return `${iso}`;
  }

  const fetchHora = async (dateTime: Date) => {
    try {
      setLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const data = await getCurrentHora(lat, lng, dateTime);
          setHoraData(data);
          setError(null)
        },
        (err) => {
          // console.error("Error getting location:", err);
          setError("Turn on your GPS and Grant Persimission to get the sunrise time for accurate calculations")
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
    <div className="w-full max-w-3xl pt-8 md:pt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold leading-none text-[#281B10] md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm font-semibold text-[#806C55] md:text-base">{t("subtitle")}</p>
        </div>
        <Image
          src="/logo.png"
          alt="Horashtak logo"
          width={96}
          height={96}
          priority
          className="size-16 shrink-0 md:size-20"
        />
      </div>

      <div className="mb-5 flex justify-center md:justify-end">
        <TimePicker onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="rounded-[18px] border border-[#F1B7AA] bg-[#FFE0D8] p-6 text-center shadow-sm">
          <p className="mb-2 font-bold text-[#7E271B]">{t("error")}: Connection Issue</p>
          <p className="mb-4 text-sm text-[#7E271B]">{error}</p>
          <p className="text-xs text-[#7E271B]/70">
            {t("tryAgain") || "Make sure the server is running at http://localhost:3000"}
          </p>
          <button
            onClick={() => handleTimeSelect(selectedTime)}
            className="mt-4 rounded-xl bg-[#7E271B] px-6 py-2 font-bold text-[#FFF8EA] transition-colors hover:bg-[#681E15]"
          >
            {t("retry") || "Retry"}
          </button>
        </div>
      )}

      {!loading && !error && horaData && <HoraCard horaData={horaData} />}

      {/* {!loading && !error && horaData && <HoraTable selectedDate={selectedTime} />} */}

      {!loading && !error && !horaData && (
        <div className="rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] p-6 text-center">
          <p className="font-semibold text-[#806C55]">{t("noData")}</p>
        </div>
      )}

      {!loading && !error && horaData && (
        <div className="mt-6 text-center text-sm font-semibold text-[#806C55]">
          <p>
            {t("lastUpdated")}: {selectedTime.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  )
}
