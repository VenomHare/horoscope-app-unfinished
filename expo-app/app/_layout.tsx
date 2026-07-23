import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { syncPermissionState } from '@/services/permissions';
// Import background tasks to register them at module scope
import '@/services/background-tasks';
import { startTimeChangeListener } from '@/services/time-change-listener';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Switzer-Regular': require('@/switzer/fonts/Switzer-Regular.ttf'),
    'Switzer-Semibold': require('@/switzer/fonts/Switzer-Semibold.ttf'),
    'Switzer-Bold': require('@/switzer/fonts/Switzer-Bold.ttf'),
    'Switzer-Extrabold': require('@/switzer/fonts/Switzer-Extrabold.ttf'),
  });

  useEffect(() => {
    syncPermissionState();
    startTimeChangeListener().catch((error) => {
      console.error('Failed to start time change listener:', error);
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="permissions" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
