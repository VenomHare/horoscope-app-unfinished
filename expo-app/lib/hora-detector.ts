export const GRAHA_SEQUENCE = [
  'Ravi',
  'Shukra',
  'Budh',
  'Chandra',
  'Shani',
  'Guru',
  'Mangal',
] as const;

export type Graha = (typeof GRAHA_SEQUENCE)[number];

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type HoraPeriod = {
  index: number;
  graha: Graha;
  start: Date;
  end: Date;
  isActive: boolean;
  isPast: boolean;
};

export type HoraDay = {
  date: Date;
  sunrise: Date;
  nextSunrise: Date;
  periods: HoraPeriod[];
  current: HoraPeriod;
};

type SunriseApiResponse = {
  status: string;
  results?: {
    sunrise: string;
  };
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMs(date: Date, ms: number) {
  return new Date(date.getTime() + ms);
}

function getGrahaForPeriod(day: Date, periodIndex: number): Graha {
  return GRAHA_SEQUENCE[(day.getDay() * 24 + periodIndex) % GRAHA_SEQUENCE.length];
}

export class HoraDetector {
  async getSunriseTime(coordinates: Coordinates, date = new Date()) {
    const dateKey = toDateKey(date);
    const response = await fetch(
      `https://api.sunrisesunset.io/json?lat=${coordinates.latitude}&lng=${coordinates.longitude}&date=${dateKey}&time_format=24`,
    );

    if (!response.ok) {
      throw new Error('Unable to load sunrise time.');
    }

    const payload = (await response.json()) as SunriseApiResponse;

    if (payload.status !== 'OK' || !payload.results?.sunrise) {
      throw new Error('Sunrise service returned an invalid response.');
    }

    return new Date(`${dateKey}T${payload.results.sunrise}`);
  }

  async getHoraDay(coordinates: Coordinates, now = new Date()): Promise<HoraDay> {
    const todaysSunrise = await this.getSunriseTime(coordinates, now);
    const usedDate = now.getTime() >= todaysSunrise.getTime() ? now : addDays(now, -1);
    const sunrise =
      usedDate === now ? todaysSunrise : await this.getSunriseTime(coordinates, usedDate);
    const nextSunrise = await this.getSunriseTime(coordinates, addDays(usedDate, 1));
    const periodLength = (nextSunrise.getTime() - sunrise.getTime()) / 24;

    const periods = Array.from({ length: 24 }, (_, index) => {
      const start = addMs(sunrise, periodLength * index);
      const end = index === 23 ? nextSunrise : addMs(sunrise, periodLength * (index + 1));

      return {
        index,
        graha: getGrahaForPeriod(usedDate, index),
        start,
        end,
        isActive: now >= start && now < end,
        isPast: now >= end,
      };
    });

    return {
      date: usedDate,
      sunrise,
      nextSunrise,
      periods,
      current: periods.find((period) => period.isActive) ?? periods[0],
    };
  }
}

export const horaDetector = new HoraDetector();
