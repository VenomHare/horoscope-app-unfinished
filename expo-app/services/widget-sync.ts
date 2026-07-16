import AsyncStorage from '@react-native-async-storage/async-storage';

import type { HoraDay } from '@/lib/hora-detector';

export async function syncWidgetSnapshot(day: HoraDay, highlightedHoras: string[]) {
  await AsyncStorage.setItem(
    'hora-widget-snapshot',
    JSON.stringify({
      graha: day.current.graha,
      start: day.current.start.toISOString(),
      end: day.current.end.toISOString(),
      date: day.date.toISOString(),
      highlighted: highlightedHoras.includes(day.current.graha),
      updatedAt: new Date().toISOString(),
    }),
  );
}
