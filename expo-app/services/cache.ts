import AsyncStorage from '@react-native-async-storage/async-storage';

import type { HoraDay } from '@/lib/hora-detector';

const CACHE_KEY = 'hora-day-cache';
const CACHE_VERSION = 1;

type CachedHoraDay = {
  version: number;
  data: HoraDay;
  cachedAt: string;
  expiresAt: string;
};

export async function getCachedHoraDay(): Promise<HoraDay | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached) as CachedHoraDay;

    // Check version compatibility
    if (parsed.version !== CACHE_VERSION) {
      await clearCachedHoraDay();
      return null;
    }

    // Check if cache is expired
    const now = new Date();
    const expiresAt = new Date(parsed.expiresAt);
    
    if (now >= expiresAt) {
      await clearCachedHoraDay();
      return null;
    }

    // Convert ISO strings back to Date objects
    return {
      ...parsed.data,
      date: new Date(parsed.data.date),
      sunrise: new Date(parsed.data.sunrise),
      nextSunrise: new Date(parsed.data.nextSunrise),
      periods: parsed.data.periods.map((period) => ({
        ...period,
        start: new Date(period.start),
        end: new Date(period.end),
      })),
      current: {
        ...parsed.data.current,
        start: new Date(parsed.data.current.start),
        end: new Date(parsed.data.current.end),
      },
    };
  } catch (error) {
    console.warn('Failed to get cached hora day:', error);
    await clearCachedHoraDay();
    return null;
  }
}

export async function setCachedHoraDay(day: HoraDay): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(day.nextSunrise);

    const cached: CachedHoraDay = {
      version: CACHE_VERSION,
      data: day,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.warn('Failed to cache hora day:', error);
  }
}

export async function clearCachedHoraDay(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear cached hora day:', error);
  }
}

export async function isCacheValid(): Promise<boolean> {
  const cached = await getCachedHoraDay();
  return cached !== null;
}
