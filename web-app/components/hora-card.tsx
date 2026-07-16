"use client"

import { useLanguage } from "@/hooks/use-language"
import { getGrahaColor, getGrahaSymbol } from "@/lib/graha-utils"

interface HoraData {
  time: string
  day: string
  hora: string
  endTime: string
}

interface HoraCardProps {
  horaData: HoraData
}

export default function HoraCard({ horaData }: HoraCardProps) {
  const { t } = useLanguage()
  const grahaColor = getGrahaColor(horaData.hora)
  const grahaSymbol = getGrahaSymbol(horaData.hora)

  return (
    <div className="relative group">
      {/* Animated glow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${grahaColor} rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse`}
      />

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 md:p-12 shadow-2xl">
        {/* Current Time Section */}
        <div className="text-center mb-8">
          <div className="text-6xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text mb-2 font-mono">
            {horaData.time}
          </div>
          <div className="text-xl md:text-2xl text-purple-300 font-semibold">{horaData.day}</div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8" />

        {/* Hora Section */}
        <div className="text-center mb-8">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-4">{t("currentHora")}</p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`text-5xl md:text-6xl animate-bounce`} style={{ animationDelay: "0s" }}>
              {grahaSymbol}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text">
              {horaData.hora}
            </div>
          </div>

          <p className="text-gray-400 text-sm">{t("horaDescription")}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8" />

        {/* End Time Section */}
        <div className="text-center">
          <p className="text-purple-400 text-sm uppercase tracking-widest mb-3">{t("endsAt")}</p>
          <div className="text-3xl md:text-4xl font-bold text-cyan-300 font-mono">{horaData.endTime}</div>
          <p className="text-gray-500 text-xs mt-2">{t("nextHoraInfo")}</p>
        </div>
      </div>
    </div>
  )
}
