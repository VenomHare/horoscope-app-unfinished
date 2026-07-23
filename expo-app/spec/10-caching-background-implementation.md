# Caching and Background Tasks Implementation

## Summary
Implemented a comprehensive caching system with sunrise-based expiration and background task scheduling for the horoscope app to improve performance and user experience.

## Changes Made

### 1. Caching Service (`services/cache.ts`)
- Created a new caching service for hora day data with sunrise-based expiration
- Cache includes version control for future compatibility
- Automatic cache invalidation when next sunrise is reached
- Handles Date serialization/deserialization for AsyncStorage
- Functions:
  - `getCachedHoraDay()`: Retrieves cached data if valid
  - `setCachedHoraDay()`: Stores hora day data with expiration
  - `clearCachedHoraDay()`: Manually clears cache
  - `isCacheValid()`: Checks if cache is currently valid

### 2. Home Screen Updates (`app/(tabs)/index.tsx`)
- Modified `loadHora()` function to support force refresh parameter
- Added cache-first approach: checks cache before recalculating
- Pull-to-refresh now forces recalculation (hard refresh)
- Regular app opens use cached data when available
- Integrated background task scheduling on component mount

### 3. Notification Preference Updates (`app/(tabs)/explore.tsx`)
- Added effect to refresh notifications when alert preferences change
- Ensures notifications are updated immediately when users modify preferences
- Uses cached data when available for immediate updates

### 4. Background Tasks Service (`services/background-tasks.ts`)
- Created comprehensive background task system using expo-background-task
- Two main background tasks:
  - `HORA_RECALCULATION_TASK`: Runs every hour to recalculate hora data
  - `WIDGET_UPDATE_TASK`: Runs every 15 minutes to update widgets
- Tasks are registered at module scope in app/_layout.tsx
- Only registered on Android (not in Expo Go)
- Tasks handle proper success/failure reporting
- Functions:
  - `scheduleBackgroundTasks()`: Registers background tasks
  - `unregisterBackgroundTasks()`: Cleanup function

### 5. Dependencies Added
- `expo-task-manager`: For defining background tasks
- `expo-background-task`: For scheduling deferrable background tasks

### 6. App Configuration Updates
- Added `expo-background-task` plugin to app.json
- Imported background tasks module in app/_layout.tsx for module-scope registration

## Technical Implementation Details

### Cache Expiration Strategy
- Cache expires at the next sunrise time
- This ensures accuracy for hora calculations which depend on sunrise
- More precise than midnight or 24-hour expiration
- Cache stores both the data and expiration timestamp

### Background Task Architecture
- Tasks defined using `TaskManager.defineTask()` at module scope
- Scheduled using `BackgroundTask.registerTaskAsync()`
- Returns proper `BackgroundTaskResult` for system optimization
- Tasks run even when app is terminated (on supported platforms)
- Hourly recalculation ensures data stays fresh
- 15-minute widget updates keep home screen widgets current

### Notification Management
- Existing notification system enhanced with cache awareness
- Preferences changes trigger immediate notification updates
- Uses cached data when available for instant response
- Maintains existing sticky notification functionality

### Performance Improvements
- Eliminates redundant API calls to sunrise service
- Reduces computation overhead by caching calculated hora tables
- Improves app startup time with cached data
- Background tasks ensure data freshness without user interaction

## User Experience Impact
- Faster app launches when cache is valid
- Reduced battery usage from fewer API calls
- More reliable notifications with background scheduling
- Widgets stay updated even when app isn't actively used
- Pull-to-refresh still provides instant data refresh when needed

## Testing Considerations
- Cache invalidation works correctly across day boundaries
- Background tasks execute properly on Android production builds
- Force refresh bypasses cache as expected
- Notification updates respond to preference changes
- Widget updates use cached data efficiently

## Future Enhancements
- Could add cache size limits if storing multiple days
- Could implement pre-fetching for next day's data
- Could add background task for cache cleanup
- Could implement more sophisticated cache invalidation based on location changes