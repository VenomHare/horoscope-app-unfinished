"use client"

import { useLanguage } from "@/hooks/use-language"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "mr", label: "मराठी" },
  ]

  return (
    <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-purple-500/30 rounded-full p-1">
      <Globe className="w-4 h-4 text-purple-400 ml-3" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as "en" | "hi" | "mr")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            language === lang.code
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              : "text-purple-300 hover:text-purple-100"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
