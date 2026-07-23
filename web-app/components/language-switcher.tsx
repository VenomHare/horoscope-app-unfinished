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
    <div className="ml-auto flex w-fit items-center gap-1 rounded-[18px] border border-[#ECD8B6] bg-[#FFF8EA] p-1 shadow-sm">
      <Globe className="ml-3 size-4 text-[#806C55]" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as "en" | "hi" | "mr")}
          className={`rounded-[14px] px-4 py-2 text-sm font-bold transition-all duration-200 ${
            language === lang.code
              ? "bg-[#2A2119] text-[#FFF8EA]"
              : "text-[#806C55] hover:bg-[#F0E2CC] hover:text-[#281B10]"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
