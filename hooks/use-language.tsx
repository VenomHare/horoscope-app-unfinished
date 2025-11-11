"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations } from "@/lib/translations"

type Language = "en" | "hi" | "mr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(()=>{
    const langCode = localStorage.getItem("lang");
    if (langCode) {
      setLanguage(langCode as Language)
    }
  },[])

  useEffect(()=>{
    localStorage.setItem("lang",language);
  },[language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
