"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Clock, Calendar } from "lucide-react"

interface TimePickerProps {
  onTimeSelect: (date: Date) => void
  selectedTime: Date
}

export default function TimePicker({ onTimeSelect, selectedTime }: TimePickerProps) {
  const { t } = useLanguage()
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(selectedTime)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    setTempDate(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":")
    const newDate = new Date(tempDate)
    newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    setTempDate(newDate)
  }

  const handleApply = () => {
    onTimeSelect(tempDate)
    setShowPicker(false)
  }

  const handleNow = () => {
    const now = new Date()
    setTempDate(now)
    onTimeSelect(now)
    setShowPicker(false)
  }

  const formatDate = (date: Date) => date.toISOString().split("T")[0]
  const formatTime = (date: Date) => date.toTimeString().slice(0, 5)

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex flex-wrap items-center justify-center gap-2 rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] px-5 py-3 font-bold text-[#281B10] shadow-sm transition-all duration-200 hover:border-[#D28719]"
      >
        <Clock size={20} />
        <span>{formatTime(selectedTime)}</span>
        <Calendar size={20} />
        <span>{formatDate(selectedTime)}</span>
      </button>

      {showPicker && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] p-5 shadow-[0_18px_28px_rgba(34,23,13,0.18)]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#806C55]">
                {t("selectDate") || "Select Date"}
              </label>
              <input
                type="date"
                value={formatDate(tempDate)}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-[#ECD8B6] bg-[#F7EFE1] px-4 py-2 font-semibold text-[#281B10] focus:border-[#D28719] focus:outline-none focus:ring-2 focus:ring-[#D28719]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#806C55]">
                {t("selectTime") || "Select Time"}
              </label>
              <input
                type="time"
                value={formatTime(tempDate)}
                onChange={handleTimeChange}
                className="w-full rounded-xl border border-[#ECD8B6] bg-[#F7EFE1] px-4 py-2 font-semibold text-[#281B10] focus:border-[#D28719] focus:outline-none focus:ring-2 focus:ring-[#D28719]/20"
              />
            </div>

            <div className="rounded-xl border border-[#ECD8B6] bg-[#F0E2CC] p-3">
              <p className="text-sm font-semibold text-[#806C55]">
                {tempDate.toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNow}
                className="flex-1 rounded-xl bg-[#2A2119] px-4 py-2 font-bold text-[#FFF8EA] transition-colors hover:bg-[#3A2D22]"
              >
                {t("now") || "Now"}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 rounded-xl bg-[#D28719] px-4 py-2 font-bold text-[#251500] transition-colors hover:bg-[#BE7816]"
              >
                {t("apply") || "Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
