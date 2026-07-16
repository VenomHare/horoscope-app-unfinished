# Init Implementation Notes

## Context

- `expo-app/spec/01-init.md` describes a managed Expo Router app for Hora Detector.
- The app needs notification and location permissions before showing the dashboard.
- Personal settings are local-only and persisted with Zustand plus AsyncStorage.
- The web app hora calculation was adapted into a native-side `HoraDetector` class.

## Changes

- Added SDK 54-compatible dependencies:
  - `zustand`
  - `expo-location`
  - `expo-notifications`
  - `@react-native-async-storage/async-storage`
- Added permission state sync and request flow.
- Added a first-run permission screen.
- Replaced the starter Home tab with a hora dashboard.
- Replaced the starter Explore tab with a Personalize tab.
- Added Marathi, English, and Hindi locale dictionaries, with Marathi as default.
- Added persisted settings for:
  - highlighted horas
  - start alert offsets per hora
  - end alert offsets per hora
  - app language
  - Android sticky notification toggle
- Added notification scheduling for configured start/end alerts.
- Added an Android sticky local notification path for the current hora.
- Added a widget snapshot sync service that stores current hora data for future native widget extensions.
- Loaded local Switzer font files in the root layout.
- Declared Expo location and notification config plugins in `app.json`.

## Notes

- Real Android and iOS home-screen widgets require platform-specific native extension code. This repo currently has no `android/` or `ios/` native projects, so the implementation stores a widget snapshot that native widget code can consume after prebuild/native extension work is added.
- Sunrise time still relies on the remote sunrise API, matching the client-side app constraint in the spec.

## Verification

- `npx tsc --noEmit`
- `npm run lint`
