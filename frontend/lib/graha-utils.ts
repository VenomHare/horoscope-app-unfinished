export const grahaSymbols: Record<string, string> = {
  Ravi: "☉",
  Shukra: "♀",
  Budh: "☿",
  Chandra: "☽",
  Shani: "♄",
  Guru: "♃",
  Mangal: "♂",
}

export const grahaColors: Record<string, string> = {
  Ravi: "from-yellow-500 to-orange-500",
  Shukra: "from-green-400 to-emerald-500",
  Budh: "from-yellow-400 to-green-400",
  Chandra: "from-blue-300 to-cyan-300",
  Shani: "from-slate-600 to-slate-700",
  Guru: "from-yellow-600 to-orange-600",
  Mangal: "from-red-500 to-orange-500",
}

export function getGrahaSymbol(graha: string): string {
  return grahaSymbols[graha] || "✦"
}

export function getGrahaColor(graha: string): string {
  return grahaColors[graha] || "from-purple-500 to-pink-500"
}
