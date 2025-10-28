import chalk from "chalk";
import geoip from "geoip-lite";

const Graha_sequence = [
  "Ravi",
  "Shukra",
  "Budh",
  "Chandra",
  "Shani",
  "Guru",
  "Mangal",
];
async function getSunriseTime() {
  const ipReq = await fetch("https://api.ipify.org?format=json");
  const { ip } = await ipReq.json();

  const geo = geoip.lookup(ip);
  let lng, lat;
  if (geo) {
    lat = geo.ll[0];
    lng = geo.ll[1];
  }
  const sunTime = await fetch(
    `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`
  );
  const data = await sunTime.json();
  const suntime = new Date(
    `${new Date().toISOString().split("T")[0]} ${data.results.sunrise}`
  );
  return suntime;
}

export async function getCurrentHora(now: Date = new Date()) {
  const todays_Sunrise_time = await getSunriseTime();
  const dayIndex = now.getDay();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const sunriseHour = todays_Sunrise_time.getHours();
  const sunriseMinutes = todays_Sunrise_time.getMinutes();

  const hashoraEnded = sunriseMinutes - currentMinutes <= 0;

  const currentHoraIndex =
    ((currentHour - sunriseHour + dayIndex * 24) % Graha_sequence.length) -
    (hashoraEnded ? 0 : 1);

  console.log(currentHoraIndex);
  console.log(
    currentHour,
    sunriseHour,
    dayIndex,
    Graha_sequence.length,
    hashoraEnded
  );
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
