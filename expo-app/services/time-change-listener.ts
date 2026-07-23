import { AppState, AppStateStatus } from 'react-native';

import { getCachedHoraDay, setCachedHoraDay } from '@/services/cache';
import { syncWidgetSnapshot } from '@/services/widget-sync';
import { refreshHoraNotifications } from '@/services/notifications';
import { useAppStore } from '@/store/app-store';

let lastKnownTime = Date.now();
let lastKnownCurrentIndex = -1;
let intervalId: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: any = null;

/**
 * Updates the current hora from cached table when time changes
 * This doesn't recalculate the entire hora table, just updates which hora is current
 */
async function updateCurrentHoraFromCache() {
  try {
    const cachedDay = await getCachedHoraDay();
    if (!cachedDay) {
      console.log('No cached hora day available for time change update');
      return;
    }

    const now = new Date();
    const currentTime = now.getTime();
    
    // Find the current period based on the new time
    const currentPeriod = cachedDay.periods.find(
      (period) => currentTime >= period.start.getTime() && currentTime < period.end.getTime()
    );

    if (currentPeriod && currentPeriod.index !== lastKnownCurrentIndex) {
      console.log('Time change detected, updating current hora from', lastKnownCurrentIndex, 'to', currentPeriod.index);
      
      // Update the cached day with the new current period
      const updatedDay = {
        ...cachedDay,
        current: currentPeriod,
      };
      
      await setCachedHoraDay(updatedDay);
      
      // Get current preferences
      const state = useAppStore.getState();
      const language = state.language;
      const highlightedHoras = state.highlightedHoras;
      
      // Update widgets and notifications with the new current hora
      await syncWidgetSnapshot(updatedDay, highlightedHoras, language);
      await refreshHoraNotifications(updatedDay, language);
      
      lastKnownCurrentIndex = currentPeriod.index;
    }
    
    lastKnownTime = currentTime;
  } catch (error) {
    console.error('Failed to update current hora from cache:', error);
  }
}

/**
 * Starts listening for time changes by checking every minute
 * Uses cached hora table to determine current hora without recalculating
 */
export async function startTimeChangeListener() {
  if (intervalId) {
    console.log('Time change listener already running');
    return;
  }

  console.log('Starting time change listener');
  
  // Initialize with current time and current hora index
  lastKnownTime = Date.now();
  
  // Initialize current hora index from cache
  try {
    const cachedDay = await getCachedHoraDay();
    if (cachedDay) {
      lastKnownCurrentIndex = cachedDay.current.index;
      console.log('Initialized time change listener with current hora index:', lastKnownCurrentIndex);
    }
  } catch (error) {
    console.error('Failed to initialize current hora index:', error);
  }
  
  // Check for time changes every minute
  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const timeDiff = Math.abs(currentTime - lastKnownTime);
    
    // If time changed by more than 30 seconds (either forward or backward)
    if (timeDiff > 30000) {
      console.log('Significant time change detected:', timeDiff, 'ms');
      updateCurrentHoraFromCache();
    }
  }, 60000); // Check every minute

  // Also check when app comes to foreground
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      const currentTime = Date.now();
      const timeDiff = Math.abs(currentTime - lastKnownTime);
      
      if (timeDiff > 30000) {
        console.log('App foreground with time change detected:', timeDiff, 'ms');
        updateCurrentHoraFromCache();
      }
    }
  };

  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
}

/**
 * Stops the time change listener
 */
export function stopTimeChangeListener() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Stopped time change listener');
  }
  
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
}
