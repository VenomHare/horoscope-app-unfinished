"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Calendar, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { getCurrentHora } from "@/lib/hora-detector"

interface HoraData {
    hora: string
    startTime: string
    endTime: string
    isPast: boolean
    isCurrent: boolean
}

const GRAHAS_MAP: Record<string, { en: string; hi: string; mr: string; symbol: string; color: string }> = {
    Ravi: { en: "Sun", hi: "रवि", mr: "रवी", symbol: "☉", color: "from-yellow-500 to-orange-500" },
    Shukra: { en: "Venus", hi: "शुक्र", mr: "शुक्र", symbol: "♀", color: "from-green-400 to-emerald-500" },
    Budh: { en: "Mercury", hi: "बुध", mr: "बुध", symbol: "☿", color: "from-yellow-400 to-green-400" },
    Chandra: { en: "Moon", hi: "चंद्र", mr: "चंद्र", symbol: "☽", color: "from-blue-300 to-cyan-300" },
    Shani: { en: "Saturn", hi: "शनि", mr: "शनि", symbol: "♄", color: "from-slate-600 to-slate-700" },
    Guru: { en: "Jupiter", hi: "बृहस्पति", mr: "गुरु", symbol: "♃", color: "from-yellow-600 to-orange-600" },
    Mangal: { en: "Mars", hi: "मंगल", mr: "मंगळ", symbol: "♂", color: "from-red-500 to-orange-500" },
    Rahu: { en: "Rahu", hi: "राहु", mr: "राहू", symbol: "⬡", color: "from-indigo-600 to-purple-700" },
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

                const sunriseData = await getCurrentHora(lat, lng, new Date(selectedDate));
                const sunriseTime: Date = sunriseData.sunriseTime;
                console.log(selectedDate);

                const firstHoraStart = new Date(sunriseTime);
                firstHoraStart.setSeconds(0, 0);

                const horaList: HoraData[] = [];
                for (let i = 0; i < 24; i++) {
                    const start = new Date(firstHoraStart);
                    start.setHours(firstHoraStart.getHours() + i);
                    const end = new Date(start);
                    end.setHours(start.getHours() + 1);

                    const graha = sunriseData.Graha_sequence[(sunriseData.currentHoraIndex + i + 1) % sunriseData.Graha_sequence.length];

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
        <div className="w-full max-w-6xl mx-auto mt-12 mb-8 px-4">
            {/* Date Picker Header */}
            <div className="bg-linear-to-r from-purple-950/50 to-pink-950/50 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-purple-400" />
                        <div>
                            <p className="text-sm text-purple-300/70 font-semibold uppercase tracking-wide">
                                {language === "en" ? "Daily Schedule" : language === "hi" ? "दैनिक समय सारणी" : "दैनिक वेळापत्रक"}
                            </p>
                            <p className="text-2xl font-bold bg-linear-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
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
                            className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 text-purple-400 hover:text-purple-300"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleToday}
                            className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
                        >
                            {language === "en" ? "Today" : language === "hi" ? "आज" : "आज"}
                        </button>

                        <button
                            onClick={handleNextDay}
                            className="p-2 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 text-purple-400 hover:text-purple-300"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-300 font-semibold text-sm">
                            {language === "en" ? "Error" : language === "hi" ? "त्रुटि" : "त्रुटी"}
                        </p>
                        <p className="text-red-200/70 text-xs">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && horas.length > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-purple-500/20 bg-slate-950/50 backdrop-blur">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-linear-to-r from-purple-950/80 to-pink-950/80 border-b border-purple-500/20">
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                                    {language === "en" ? "Hour" : language === "hi" ? "घंटा" : "तास"}
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                                    {language === "en" ? "Start Time" : language === "hi" ? "शुरुआत का समय" : "सुरुवातीचा वेळ"}
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                                    {language === "en" ? "End Time" : language === "hi" ? "समाप्ति का समय" : "समाप्तीचा वेळ"}
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                                    {language === "en" ? "Graha" : language === "hi" ? "ग्रह" : "ग्रह"}
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-purple-300 uppercase tracking-wider">
                                    {language === "en" ? "Status" : language === "hi" ? "स्थिति" : "स्थिती"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {horas.map((hora, index) => {
                                const grahaInfo = getGrahaInfo(hora.hora)
                                const rowBg = hora.isPast
                                    ? "bg-slate-800/30 opacity-50"
                                    : hora.isCurrent
                                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-4 border-cyan-400"
                                        : "bg-slate-800/20 hover:bg-slate-800/40"

                                const statusColor = hora.isPast
                                    ? "text-slate-500"
                                    : hora.isCurrent
                                        ? "text-cyan-400 font-bold"
                                        : "text-green-400"

                                return (
                                    <tr
                                        key={index}
                                        className={`${rowBg} border-b border-purple-500/10 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10`}
                                    >
                                        <td className="px-4 sm:px-6 py-4 font-semibold text-white">
                                            {String(index).padStart(2, "0")}
                                            {hora.isCurrent && (
                                                <span className="ml-2 inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-white/80 font-mono">{hora.startTime}</td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-white/80 font-mono">{hora.endTime}</td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{grahaInfo.symbol}</span>
                                                <span className="text-sm font-semibold text-white">
                                                    {language === "en" ? grahaInfo.en : language === "hi" ? grahaInfo.hi : grahaInfo.mr}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`px-4 sm:px-6 py-4 text-xs font-bold uppercase tracking-wide ${statusColor}`}>
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
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <p className="text-yellow-300 font-semibold">
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
