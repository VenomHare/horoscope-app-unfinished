"use client"

import { useLanguage } from "@/hooks/use-language"
import { getGrahaSymbol, getGrahaTheme } from "@/lib/graha-utils"

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
  const grahaTheme = getGrahaTheme(horaData.hora)
  const grahaSymbol = getGrahaSymbol(horaData.hora)

  return (
    <div className="relative">
      <div
        className="absolute inset-x-8 top-8 h-56 rounded-[28px] blur-2xl"
        style={{ backgroundColor: grahaTheme.background, opacity: 0.22 }}
      />

      <div
        className="relative min-h-[270px] rounded-[28px] p-6 shadow-[0_18px_28px_rgba(34,23,13,0.22)] md:p-8"
        style={{ backgroundColor: grahaTheme.background, color: grahaTheme.foreground }}
      >
        <div className="flex h-full min-h-[220px] flex-col justify-between gap-8">
          <div className="flex items-start justify-between gap-4">
            <p className="text-base font-bold">{t("currentHora")}</p>
            <div className="text-right">
              <div className="font-mono text-2xl font-bold md:text-3xl">{horaData.time}</div>
              <div className="mt-1 text-sm font-bold opacity-80">{horaData.day}</div>
            </div>
          </div>

          <div>
            <div className="text-[86px] leading-none md:text-[104px]">
              {grahaSymbol}
            </div>
            <div className="mt-2 text-5xl font-extrabold leading-none md:text-6xl">
              {horaData.hora}
            </div>
            <p className="mt-3 max-w-sm text-sm font-semibold opacity-75">{t("horaDescription")}</p>
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-current/20 pt-4">
            <div className="text-sm font-bold">{t("endsAt")}</div>
            <div className="text-right">
              <div className="font-mono text-3xl font-bold">{horaData.endTime}</div>
              <p className="mt-1 text-xs font-semibold opacity-70">{t("nextHoraInfo")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
