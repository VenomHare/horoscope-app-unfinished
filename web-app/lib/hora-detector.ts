const Graha_sequence = [
  "Ravi",
  "Shukra",
  "Budh",
  "Chandra",
  "Shani",
  "Guru",
  "Mangal",
];

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getSunriseTime(lat: number, lng: number, date?: Date) {
  const dateObj = date || new Date();
  const dateStr = toLocalDateString(dateObj);

  const sunTime = await fetch(
    `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=${dateStr}&time_format=24`
  );
  const data = await sunTime.json();
  const suntime = new Date(`${dateStr}T${data.results.sunrise}`);
  return suntime;
}

export async function getCurrentHora(lat: number, lng: number, now?: Date) {
  const time: Date = now || new Date();

  const todaysSunrise = await getSunriseTime(lat, lng, time);

  const timeMs = time.getTime();
  const todaySunriseMs = todaysSunrise.getTime();

  let usedDate: Date;
  let sunriseTime: Date;
  let nextSunriseTime: Date;

  if (timeMs >= todaySunriseMs) {
    usedDate = time;
    sunriseTime = todaysSunrise;
    const tomorrow = new Date(time);
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextSunriseTime = await getSunriseTime(lat, lng, tomorrow);
  } else {
    const yesterday = new Date(time);
    yesterday.setDate(yesterday.getDate() - 1);
    sunriseTime = await getSunriseTime(lat, lng, yesterday);
    usedDate = yesterday;
    nextSunriseTime = todaysSunrise;
  }

  const dayIndex = usedDate.getDay();
  const currentHour = time.getHours();
  const currentMinutes = time.getMinutes();

  const sunriseHour = sunriseTime.getHours();
  const sunriseMinutes = sunriseTime.getMinutes();

  const hourCalculated =
    currentHour > sunriseHour ||
    (currentHour === sunriseHour && currentMinutes >= sunriseMinutes)
      ? currentHour - sunriseHour
      : 24 - sunriseHour + currentHour;
  const hashoraEnded = currentMinutes >= sunriseMinutes;

  const currentHoraCalculation =
    ((hourCalculated + dayIndex * 24) - (hashoraEnded ? 0 : 1) % Graha_sequence.length);
  const currentHoraIndex = currentHoraCalculation % Graha_sequence.length;

  let endHour = hashoraEnded ? currentHour + 1 : currentHour;
  let endMinutes = sunriseMinutes;

  const normalEndTime = new Date(time);
  normalEndTime.setHours(endHour, endMinutes, 0, 0);

  if (normalEndTime.getTime() > nextSunriseTime.getTime()) {
    endHour = nextSunriseTime.getHours();
    endMinutes = nextSunriseTime.getMinutes();
  }

  return {
    time: `${currentHour}:${currentMinutes.toString().padStart(2, "0")}`,
    day: usedDate.toLocaleDateString("en-US", {
      weekday: "long",
    }),
    hora: Graha_sequence[currentHoraIndex],
    endTime: `${endHour}:${endMinutes.toString().padStart(2, "0")}`,
    sunriseTime: sunriseTime,
    currentHoraIndex,
    Graha_sequence,
  };
}
