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
        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Clock size={20} />
        <span>{formatTime(selectedTime)}</span>
        <Calendar size={20} />
        <span>{formatDate(selectedTime)}</span>
      </button>

      {showPicker && (
        <div className="absolute top-full mt-3 right-0 bg-linear-to-br from-slate-900 to-purple-900 border border-purple-500/30 rounded-xl p-6 shadow-2xl z-50 w-80 backdrop-blur-sm">
          <div className="space-y-4">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                {t("selectDate") || "Select Date"}
              </label>
              <input
                type="date"
                value={formatDate(tempDate)}
                onChange={handleDateChange}
                className="w-full px-4 py-2 bg-slate-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                {t("selectTime") || "Select Time"}
              </label>
              <input
                type="time"
                value={formatTime(tempDate)}
                onChange={handleTimeChange}
                className="w-full px-4 py-2 bg-slate-800 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>

            {/* Display Selected DateTime */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <p className="text-sm text-purple-300">
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

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleNow}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-semibold transition-colors"
              >
                {t("now") || "Now"}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-colors"
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
