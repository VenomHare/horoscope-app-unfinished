"use client";

import { useLanguage } from "@/hooks/use-language";
import HoraCard from "./hora-card";
import LoadingSpinner from "./loading-spinner";
import TimePicker from "./time-picker";
import useHora from "@/hooks/use-hora";

export default function HoraDisplay() {
  const { t } = useLanguage();

  const { 
    loading, 
    error, 
    specificHoraData, 
    selectedTime, 
    handleTimeSelect 
  } = useHora();

  return (
    <div className="w-full max-w-3xl mt-[10dvh]">
      <div className="text-center mb-12">
        <h1 className="pt-4 text-5xl md:text-6xl font-bold bg-linear-to-r from-amber-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 animate-pulse">
          {t("title")}
        </h1>
        <p className="text-purple-300 text-lg">{t("subtitle")}</p>
      </div>

      <div className="flex justify-center mb-8">
        <TimePicker
          onTimeSelect={handleTimeSelect}
          selectedTime={selectedTime}
        />
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center backdrop-blur-sm">
          <p className="text-red-300 font-semibold mb-2">
            {t("error")}: Connection Issue
          </p>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <p className="text-red-200/70 text-xs">
            {t("tryAgain") ||
              "Make sure the server is running at http://localhost:3000"}
          </p>
          <button
            onClick={() => handleTimeSelect(selectedTime)}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
          >
            {t("retry") || "Retry"}
          </button>
        </div>
      )}

      {!loading && !error && specificHoraData && (
        <HoraCard horaData={specificHoraData} />
      )}

      {/* {!loading && !error && horaData && <HoraTable selectedDate={selectedTime} />} */}

      {!loading && !error && !specificHoraData && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6 text-center backdrop-blur-sm">
          <p className="text-yellow-300">{t("noData")}</p>
        </div>
      )}

      {!loading && !error && specificHoraData && (
        <div className="mt-12 text-center text-sm text-purple-400">
          <p>
            {t("lastUpdated")}: {selectedTime.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
