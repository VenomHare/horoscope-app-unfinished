"use client"

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#ECD8B6]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#D28719] border-t-[#8F4E1F] animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#2A2119] animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <p className="text-lg font-bold text-[#806C55]">Loading your hora...</p>
    </div>
  )
}
