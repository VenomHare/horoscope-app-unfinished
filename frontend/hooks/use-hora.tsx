import { useEffect, useState } from "react";

interface HoraData {
  hora: string;
  startTime: string;
  endTime: string;
  isPast: boolean;
  isCurrent: boolean;
}

interface SpecificHoraData {
  time: string;
  day: string;
  hora: string;
  endTime: string;
}

const useHora = () => {
  const [SunriseTime, setSunriseTime] = useState<Date>(
    new Date("2025-11-02T06:35:00+05:30")
  );
  const [horas, setHoras] = useState<HoraData[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableDate, setTableDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [specificHoraData, setSpecificHoraData] =
    useState<SpecificHoraData | null>(null);

  const Graha_sequence = [
    "Ravi",
    "Shukra",
    "Budh",
    "Chandra",
    "Shani",
    "Guru",
    "Mangal",
  ];

  useEffect(() => {
    const main = async () => {
      await updateSunriseTime();
      await handleTimeSelect(new Date());
    };
    main();
  }, [tableDate]);

  useEffect(() => {
    const main = async () => {
      await fetchAllHoras(tableDate);
    };
    main();
  }, [SunriseTime]);

  const updateSunriseTime = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const time = await getSunriseTime(lat, lng);
      console.log("Setting Time to ", time);
      setSunriseTime(time);
    });
  };

  async function handleTimeSelect(time: Date) {
    setSelectedTime(time);
    const data = await getCurrentHora(time);
    setSpecificHoraData({
      hora: Graha_sequence[data.currentHoraIndex],
      time: `${time.getHours()}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      endTime: data.endTime,
      day: time.toLocaleDateString("en-US", {
        weekday: "long",
      }),
    });
  }

  async function getSunriseTime(lat: number, lng: number) {
    const sunTime = await fetch(
      `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`
    );
    const data = await sunTime.json();
    const suntime = new Date(
      `${new Date().toISOString().split("T")[0]} ${data.results.sunrise}`
    );
    console.log(suntime);
    return suntime;
  }

  async function getCurrentHora(now: Date) {
    const dayIndex = now.getDay();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const sunriseHour = SunriseTime.getHours();
    const sunriseMinutes = SunriseTime.getMinutes();

    const hourCalculated =
      currentHour >= sunriseHour
        ? currentHour - sunriseHour
        : 24 - sunriseHour + currentHour;
    const hashoraEnded = sunriseMinutes - currentMinutes <= 0;

    const currentHoraCalculation =
      hourCalculated + dayIndex * 24 - (hashoraEnded ? 0 : 1);
    const currentHoraIndex = currentHoraCalculation % Graha_sequence.length;

    console.log(
      `(${hourCalculated} + (${dayIndex} * 24  )) - (${
        hashoraEnded ? 0 : 1
      }) % 7 = ${currentHoraIndex}`
    );
    // console.log(
    //   currentHour,
    //   sunriseHour,
    //   hourCalculated,
    //   dayIndex,
    //   Graha_sequence.length,
    //   hashoraEnded
    // );
    // console.log(
    //   chalk.cyan(
    //     `Current Hora as of ${time.toLocaleDateString("en-US", {
    //       weekday: "long",
    //     })} at ${currentHour}:${currentMinutes.toString().padStart(2, "0")} is ${
    //       Graha_sequence[currentHoraIndex]
    //     } and will end at ${
    //       hashoraEnded ? currentHour + 1 : currentHour
    //     }:${sunriseMinutes}`
    //   )
    // );
    return {
      time: `${currentHour}:${currentMinutes.toString().padStart(2, "0")}`,
      day: now.toLocaleDateString("en-US", {
        weekday: "long",
      }),
      hora: Graha_sequence[currentHoraIndex],
      endTime: `${
        hashoraEnded ? currentHour + 1 : currentHour
      }:${sunriseMinutes}`,
      currentHoraIndex,
    };
  }

  async function getSunriseHora(day: Date) {
    const now = new Date(SunriseTime);
    now.setDate(day.getDate());
    const dayIndex = now.getDay();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const sunriseHour = SunriseTime.getHours();
    const sunriseMinutes = SunriseTime.getMinutes();

    const hourCalculated =
      currentHour >= sunriseHour
        ? currentHour - sunriseHour
        : 24 - sunriseHour + currentHour;
    const hashoraEnded = sunriseMinutes - currentMinutes <= 0;

    const currentHoraCalculation =
      hourCalculated + dayIndex * 24 - (hashoraEnded ? 0 : 1);
    const currentHoraIndex = currentHoraCalculation % Graha_sequence.length;

    console.log(
      `(${hourCalculated} + (${dayIndex} * 24  )) - (${
        hashoraEnded ? 0 : 1
      }) % 7 = ${currentHoraIndex}`
    );

    return {
      time: `${currentHour}:${currentMinutes.toString().padStart(2, "0")}`,
      day: now.toLocaleDateString("en-US", {
        weekday: "long",
      }),
      hora: Graha_sequence[currentHoraIndex],
      endTime: `${
        hashoraEnded ? currentHour + 1 : currentHour
      }:${sunriseMinutes}`,
      currentHoraIndex,
    };
  }

  const fetchAllHoras = async (selectedDate: Date) => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();

      const sunriseData = await getSunriseHora(new Date(selectedDate));
      console.log(await getSunriseHora(new Date(selectedDate)));

      const firstHoraStart = new Date(SunriseTime);
      firstHoraStart.setSeconds(0, 0);

      const horaList: HoraData[] = [];
      for (let i = 0; i < 24; i++) {
        const start = new Date(firstHoraStart);
        start.setHours(firstHoraStart.getHours() + i);
        const end = new Date(start);
        end.setHours(start.getHours() + 1);

        const graha =
          Graha_sequence[
            (sunriseData.currentHoraIndex + i) % Graha_sequence.length
          ];

        const isCurrent = now >= start && now < end;
        const isPast = now >= end;

        horaList.push({
          hora: graha,
          startTime: `${
            start.getHours() % 12 !== 0
              ? start.getHours() % 12
              : start.getHours()
          }:${start.getMinutes().toString().padStart(2, "0")}`,
          endTime: `${
            end.getHours() % 12 !== 0 ? end.getHours() % 12 : end.getHours()
          }:${end.getMinutes().toString().padStart(2, "0")}`,
          isPast,
          isCurrent,
        });
      }
      setHoras(horaList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch hora data"
      );
      setHoras([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    SunriseTime,
    Graha_sequence,
    updateSunriseTime,
    getSunriseTime,
    getCurrentHora,
    getSunriseHora,
    horas,
    tableDate,
    setTableDate,
    error,
    loading,
    specificHoraData,
    selectedTime,
    handleTimeSelect,
  };
};

export default useHora;
