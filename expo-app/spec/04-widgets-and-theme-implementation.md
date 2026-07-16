# Widgets And Theme Implementation Notes

## Context

- `03-widgets-and-theme.md` was written after Android development-build testing.
- No iOS widget testing was done.
- The current app is still a managed Expo app without checked-in `android/` or `ios/` folders.

## Changes

- Added light/dark app theme tokens and switched screen, tab, permission, dashboard, and personalization colors to the active phone color scheme.
- Fixed active tab color so the selected icon is visible on light backgrounds.
- Changed Android/web tab icons to smoother Material Community icons.
- Reduced hora table color noise:
  - normal rows now use neutral theme colors
  - planet colors are only used when a hora is highlighted
- Updated permission copy in English, Marathi, and Hindi to explain location is needed for precise sunrise time.
- Added localized graha names in English, Marathi, and Hindi.
- Updated dashboard, table, personalization, and notification titles to use localized graha names.
- Updated start/end alert notification body to the requested shape:
  - `X Hora is starting in y minutes`
  - `X Hora is ending in y minutes`
- Added an app-side sticky notification watchdog:
  - checks every 30 seconds while the app process is alive
  - checks again when the app returns to foreground
  - recreates the sticky notification if it was cleared
- Added an Android widget config plugin scaffold:
  - registers a widget receiver in the Android manifest during prebuild
  - creates `hora_widget_info.xml`
  - creates a placeholder widget layout and background drawable

## Native Limits

- A real Android widget requires native Android receiver/update code to read app data and update `RemoteViews`.
- Keeping updates alive after the app is cleared from recent apps cannot be guaranteed from React Native JS alone. Android can stop the JS process. This needs a native foreground service or `WorkManager`/alarm-based native scheduling strategy.
- The current config plugin should make the widget provider available after generating/rebuilding native Android, but it is not yet a full live widget implementation.

## Verification

- `npx tsc --noEmit`
- `npm run lint`
