// import chalk from "chalk";

const Graha_sequence = [
  "Ravi",
  "Shukra",
  "Budh",
  "Chandra",
  "Shani",
  "Guru",
  "Mangal",
];
async function getSunriseTime(lat: number, lng: number) {
  
  const sunTime = await fetch(
    `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`
  );
  const data = await sunTime.json();
  const suntime = new Date(
    `${new Date().toISOString().split("T")[0]} ${data.results.sunrise}`
  );
  return suntime;
}

export async function getCurrentHora(lat : number, lng: number,now: Date = new Date()) {
  const todays_Sunrise_time = await getSunriseTime(lat, lng);
  const dayIndex = now.getDay();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const sunriseHour = todays_Sunrise_time.getHours();
  const sunriseMinutes = todays_Sunrise_time.getMinutes();

  const hourCalculated = currentHour > sunriseHour ? currentHour - sunriseHour : 24 - sunriseHour + currentHour;
  const hashoraEnded = sunriseMinutes - currentMinutes <= 0;

  const currentHoraCalculation =
    ((hourCalculated + dayIndex * 24) - (hashoraEnded ? 0 : 1) % Graha_sequence.length);
  const currentHoraIndex = currentHoraCalculation % Graha_sequence.length;
  
  // console.log(currentHoraIndex);
  // console.log(
  //   (hourCalculated + (dayIndex * 24  )) - (hashoraEnded ? 0 : 1) % 7,
  //   currentHour,
  //   sunriseHour,
  //   hourCalculated,
  //   dayIndex,
  //   Graha_sequence.length,
  //   hashoraEnded
  // );
//   console.log(
//     chalk.cyan(
//       `Current Hora as of ${now.toLocaleDateString("en-US", {
//         weekday: "long",
//       })} at ${currentHour}:${currentMinutes.toString().padStart(2, "0")} is ${
//         Graha_sequence[currentHoraIndex]
//       } and will end at ${
//         hashoraEnded ? currentHour + 1 : currentHour
//       }:${sunriseMinutes}`
//     )
//   );
  return {
    time: `${currentHour}:${currentMinutes.toString().padStart(2, "0")}`,
    day: now.toLocaleDateString("en-US", {
      weekday: "long",
    }),
    hora: Graha_sequence[currentHoraIndex],
    endTime: `${
      hashoraEnded ? currentHour + 1 : currentHour
    }:${sunriseMinutes}`,
  };
}
