# Bug Fixes Implementation

## Overview
Implemented 5 bug fixes from spec/11-bug-fixes.md to improve hora tracking, notifications, and widget functionality.

## Changes Made

### 1. Time Change Listener with Cached Table Usage
**File:** `services/time-change-listener.ts` (new file)
- Created time change listener that monitors device time changes every minute
- When time changes significantly (>30 seconds), updates current hora from cached table without recalculating entire hora table
- Also monitors app state changes (foreground/background) to detect time changes
- Updates widget and notifications when hora changes due to time adjustment
- Integrated into app lifecycle in `app/_layout.tsx`

### 2. Background Task Interval Reduction
**File:** `services/background-tasks.ts`
- Changed hora recalculation task interval from 1 hour to 30 minutes
- This ensures more frequent updates to catch time changes between manual updates

### 3. Notification Scheduling
**File:** `services/notifications.ts`
- Already implemented correctly - `refreshHoraNotifications` clears all scheduled notifications and re-schedules them on every call
- This ensures notifications are properly cleared and re-scheduled on every recalculation

### 4. Maximum Priority Notifications
**File:** `services/notifications.ts`
- Set `shouldPlaySound: true` in notification handler
- Added `AndroidNotificationPriority.MAX` to all notification content (start alerts, end alerts, sticky notifications)
- Applied platform-specific conditional for Android priority settings
- This ensures notifications appear on top with sound and maximum interruption

### 5. Sticky Notifications Default
**File:** `store/app-store.ts`
- Changed `stickyNotificationsEnabled` default from `false` to `true`
- Sticky notifications will now be enabled by default for new users

### 6. Widget Redesign
**File:** `plugins/with-android-hora-widget.js`
- Changed widget size from 4x2 cells (180dp x 90dp) to 2x2 cells (90dp x 90dp)
- Redesigned layout with FrameLayout to support background icon
- Added background icon TextView positioned on right side with 80sp size and 0.15 alpha
- Increased hora name text size from 26sp to 28sp for better visibility
- Changed background color from dark (#2A2119) to light (#FFF8EA)
- Changed text colors from light to dark for better contrast on light background
- Updated widget module and receiver to support theme-aware colors
- Added theme detection in widget sync service

### 7. Theme-Aware Widget Background
**File:** `services/widget-sync.ts`
- Added theme detection from app store
- Pass `isDarkTheme` flag to native widget module
- Widget receiver applies appropriate colors based on theme:
  - Light theme: light background (#FFF8EA), dark text (#2A2119)
  - Dark theme: dark text (#FFF8EA) for content
- Background icon alpha adjusted based on theme for proper visibility

## Testing
- Ran ESLint to verify code quality
- Fixed unused import warning in index.tsx
- All linting passed successfully

## Technical Notes
- Time change listener uses interval-based approach since React Native doesn't provide native time change events
- Widget theme detection is simplified (only handles explicit dark theme, not system theme detection in service functions)
- Native widget files will be regenerated on next build with the plugin changes
- Notification priority changes are Android-specific due to platform differences in notification handling

## Files Modified
1. `services/time-change-listener.ts` (new)
2. `services/background-tasks.ts`
3. `services/notifications.ts`
4. `store/app-store.ts`
5. `plugins/with-android-hora-widget.js`
6. `services/widget-sync.ts`
7. `app/_layout.tsx`
8. `app/(tabs)/index.tsx`
