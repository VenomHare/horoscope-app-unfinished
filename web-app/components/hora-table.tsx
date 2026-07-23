"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Calendar, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { getSunriseTime } from "@/lib/hora-detector"

interface HoraData {
    hora: string
    startTime: string
    endTime: string
    isPast: boolean
    isCurrent: boolean
}

const GRAHAS_MAP: Record<string, { en: string; hi: string; mr: string; symbol: string; color: string }> = {
    Ravi: { en: "Sun", hi: "रवि", mr: "रवी", symbol: "☉", color: "#F0A51A" },
    Shukra: { en: "Venus", hi: "शुक्र", mr: "शुक्र", symbol: "♀", color: "#41A678" },
    Budh: { en: "Mercury", hi: "बुध", mr: "बुध", symbol: "☿", color: "#C5B52C" },
    Chandra: { en: "Moon", hi: "चंद्र", mr: "चंद्र", symbol: "☽", color: "#78A8D8" },
    Shani: { en: "Saturn", hi: "शनि", mr: "शनि", symbol: "♄", color: "#5C6370" },
    Guru: { en: "Jupiter", hi: "बृहस्पति", mr: "गुरु", symbol: "♃", color: "#D28719" },
    Mangal: { en: "Mars", hi: "मंगल", mr: "मंगळ", symbol: "♂", color: "#D84B35" },
    Rahu: { en: "Rahu", hi: "राहु", mr: "राहू", symbol: "⬡", color: "#5C6370" },
}

export default function HoraTable() {
    const { language } = useLanguage()
    const [horas, setHoras] = useState<HoraData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState(new Date())

    useEffect(() => {
        fetchAllHoras()
    }, [selectedDate])

    const fetchAllHoras = async () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            try {
                setLoading(true)
                setError(null)

                const now = new Date();

                const sunriseTime = await getSunriseTime(lat, lng, selectedDate);
                const firstGrahaIndex = (selectedDate.getDay() * 3) % 7;

                const GRAHAS = ["Ravi", "Shukra", "Budh", "Chandra", "Shani", "Guru", "Mangal"];

                const firstHoraStart = new Date(sunriseTime);
                firstHoraStart.setSeconds(0, 0);

                const horaList: HoraData[] = [];
                for (let i = 0; i < 24; i++) {
                    const start = new Date(firstHoraStart);
                    start.setHours(firstHoraStart.getHours() + i);
                    const end = new Date(start);
                    end.setHours(start.getHours() + 1);

                    const graha = GRAHAS[(firstGrahaIndex + i) % GRAHAS.length];

                    const isCurrent = now >= start && now < end;
                    const isPast = now >= end;

                    horaList.push({
                        hora: graha,
                        startTime: `${start.getHours() % 12 !== 0 ? start.getHours() % 12: start.getHours() }:${start.getMinutes().toString().padStart(2, '0')}`,
                        endTime: `${end.getHours() % 12 !== 0  ? end.getHours() % 12 : end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`,
                        isPast,
                        isCurrent,
                    });
                }

                setHoras(horaList);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch hora data")
                setHoras([])
            } finally {
                setLoading(false)
            }
        },
            (err) => {
                setError(err instanceof Error ? err.message : "Failed to fetch hora data")
                setHoras([])
            })
    }

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() - 1)
        setSelectedDate(newDate)
    }

    const handleNextDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + 1)
        setSelectedDate(newDate)
    }

    const handleToday = () => {
        setSelectedDate(new Date())
    }

    const getGrahaInfo = (grahaName: string) => {
        return GRAHAS_MAP[grahaName] || GRAHAS_MAP["Ravi"]
    }

    return (
        <div className="mx-auto mb-8 mt-10 w-full max-w-6xl px-0 md:px-4">
            <div className="mb-5 rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="size-6 text-[#8F4E1F]" />
                        <div>
                            <p className="text-sm font-extrabold text-[#806C55]">
                                {language === "en" ? "Daily Schedule" : language === "hi" ? "दैनिक समय सारणी" : "दैनिक वेळापत्रक"}
                            </p>
                            <p className="text-xl font-extrabold text-[#281B10] md:text-2xl">
                                {selectedDate.toLocaleDateString(language === "en" ? "en-US" : language === "hi" ? "hi-IN" : "mr-IN", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrevDay}
                            className="rounded-xl p-2 text-[#806C55] transition-colors duration-200 hover:bg-[#F0E2CC] hover:text-[#281B10]"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleToday}
                            className="rounded-xl bg-[#2A2119] px-4 py-2 text-sm font-bold text-[#FFF8EA] transition-colors duration-200 hover:bg-[#3A2D22]"
                        >
                            {language === "en" ? "Today" : language === "hi" ? "आज" : "आज"}
                        </button>

                        <button
                            onClick={handleNextDay}
                            className="rounded-xl p-2 text-[#806C55] transition-colors duration-200 hover:bg-[#F0E2CC] hover:text-[#281B10]"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 flex gap-3 rounded-[18px] border border-[#F1B7AA] bg-[#FFE0D8] p-4">
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#7E271B]" />
                    <div>
                        <p className="text-sm font-bold text-[#7E271B]">
                            {language === "en" ? "Error" : language === "hi" ? "त्रुटि" : "त्रुटी"}
                        </p>
                        <p className="text-xs text-[#7E271B]/70">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-[18px] bg-[#FFF8EA]" />
                    ))}
                </div>
            )}

            {!loading && horas.length > 0 && (
                <div className="overflow-x-auto rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#ECD8B6] bg-[#F0E2CC]">
                                <th className="px-4 py-4 text-left text-sm font-extrabold text-[#806C55] sm:px-6">
                                    {language === "en" ? "Hour" : language === "hi" ? "घंटा" : "तास"}
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-extrabold text-[#806C55] sm:px-6">
                                    {language === "en" ? "Start Time" : language === "hi" ? "शुरुआत का समय" : "सुरुवातीचा वेळ"}
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-extrabold text-[#806C55] sm:px-6">
                                    {language === "en" ? "End Time" : language === "hi" ? "समाप्ति का समय" : "समाप्तीचा वेळ"}
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-extrabold text-[#806C55] sm:px-6">
                                    {language === "en" ? "Graha" : language === "hi" ? "ग्रह" : "ग्रह"}
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-extrabold text-[#806C55] sm:px-6">
                                    {language === "en" ? "Status" : language === "hi" ? "स्थिति" : "स्थिती"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {horas.map((hora, index) => {
                                const grahaInfo = getGrahaInfo(hora.hora)
                                const rowBg = hora.isPast
                                    ? "bg-[#F0E2CC]/60 opacity-60"
                                    : hora.isCurrent
                                        ? "border-l-4 bg-[#FFF2CC]"
                                        : "bg-[#FFF8EA] hover:bg-[#F7EFE1]"

                                const statusColor = hora.isPast
                                    ? "text-[#806C55]"
                                    : hora.isCurrent
                                        ? "font-bold text-[#8F4E1F]"
                                        : "text-[#41A678]"

                                return (
                                    <tr
                                        key={index}
                                        className={`${rowBg} border-b border-[#ECD8B6] transition-colors duration-200`}
                                        style={hora.isCurrent ? { borderLeftColor: grahaInfo.color } : undefined}
                                    >
                                        <td className="px-4 py-4 font-bold text-[#281B10] sm:px-6">
                                            {String(index).padStart(2, "0")}
                                            {hora.isCurrent && (
                                                <span className="ml-2 inline-block size-2 animate-pulse rounded-full bg-[#D28719]" />
                                            )}
                                        </td>
                                        <td className="px-4 py-4 font-mono text-sm font-semibold text-[#806C55] sm:px-6">{hora.startTime}</td>
                                        <td className="px-4 py-4 font-mono text-sm font-semibold text-[#806C55] sm:px-6">{hora.endTime}</td>
                                        <td className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="flex size-9 items-center justify-center rounded-xl bg-[#E9D8BD] text-xl text-[#281B10]">
                                                    {grahaInfo.symbol}
                                                </span>
                                                <span className="text-sm font-bold text-[#281B10]">
                                                    {language === "en" ? grahaInfo.en : language === "hi" ? grahaInfo.hi : grahaInfo.mr}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`px-4 py-4 text-xs font-extrabold sm:px-6 ${statusColor}`}>
                                            {hora.isPast
                                                ? language === "en"
                                                    ? "Passed"
                                                    : language === "hi"
                                                        ? "बीत गया"
                                                        : "संपले"
                                                : hora.isCurrent
                                                    ? language === "en"
                                                        ? "Active"
                                                        : language === "hi"
                                                            ? "सक्रिय"
                                                            : "सक्रिय"
                                                    : language === "en"
                                                        ? "Upcoming"
                                                        : language === "hi"
                                                            ? "आने वाले"
                                                            : "येणार"}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* No Data State */}
            {!loading && horas.length === 0 && !error && (
                <div className="rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] p-8 text-center">
                    <AlertCircle className="mx-auto mb-3 size-8 text-[#D28719]" />
                    <p className="font-bold text-[#806C55]">
                        {language === "en"
                            ? "No data available"
                            : language === "hi"
                                ? "कोई डेटा उपलब्ध नहीं"
                                : "कोणताही डेटा उपलब्ध नाही"}
                    </p>
                </div>
            )}
        </div>
    )
}
