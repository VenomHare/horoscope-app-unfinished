import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useAppStore } from '@/store/app-store';

export function useColorScheme() {
  const nativeColorScheme = useNativeColorScheme();
  const storeTheme = useAppStore((state) => state.theme);
  return storeTheme === 'system' ? nativeColorScheme : storeTheme;
}
