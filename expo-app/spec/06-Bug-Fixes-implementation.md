# Horashtak Project Implementation Learnings

This document summarizes the technical learnings and implementation details for the Horashtak app features: Zustand theme switching, dark mode visual enhancements, and native Android widget integration.

---

## 1. Zustand & App-Wide Theme Integration

### Overriding `useColorScheme`
Instead of manually passing theme variables down to every screen and component or wrapping the app in complex React Context providers, we customized the centralized `@/hooks/use-color-scheme` hook:
* The application stores the user's theme selection (`"light" | "dark" | "system"`) in Zustand, persisted in `AsyncStorage`.
* We updated `hooks/use-color-scheme.ts` to read the Zustand store:
  - If the store theme is `"system"`, it returns the native device color scheme (`useColorScheme` from `react-native`).
  - If the store theme is `"light"` or `"dark"`, it overrides the system setting and returns the selected theme.
* All components using `@/hooks/use-color-scheme` automatically update when the Zustand theme changes.

---

## 2. Highlighting and Color Contrast in Dark Mode

* **The Issue**: In dark mode, the active theme's text color is light (`#F7EFE1`). However, highlighted hora rows use a light pastel color (`colors.soft`, e.g., `#FFF2CC`) as their background. This led to light text on a light background, making it unreadable.
* **The Fix**: Because `colors.soft` remains a light color in both light and dark modes, we modified the text styling in `HomeScreen`'s hora list to use the **light theme's dark text color** (`AppThemes.light.text` and `AppThemes.light.textMuted`) whenever the row is highlighted. This guarantees high-contrast text readability regardless of the device's theme mode.

---

## 3. Expo Native Android Widget Integration

Creating a functional Android widget inside a managed Expo project (without checking in `android/` directories) requires a custom Expo Config Plugin.

### The Challenge
A native Android Widget (`AppWidgetProvider`) runs outside the React Native JS bundle context. To display active hora data and update it reactively:
1. We cannot easily pull values from `AsyncStorage` inside Java/Kotlin without reading SQLite directly, which is slow and structurally fragile.
2. We need a way for the React Native JS thread to instantly push widget data updates to native code.

### The Solution: React Native Native Module
We implemented a custom native Android module to act as a bridge:

1. **Config Plugin Additions (`with-android-hora-widget.js`)**:
   * Registers `.HoraWidgetReceiver` in the `AndroidManifest.xml` during prebuild.
   * Generates the Android resources (`xml/hora_widget_info.xml`, `layout/hora_widget.xml`, `drawable/hora_widget_background.xml`).
   * Writes three new Kotlin files to the java directory during the prebuild step:
     - `HoraWidgetReceiver.kt`: Extends `AppWidgetProvider` to load `hora_widget` layout and populate text fields from `SharedPreferences`.
     - `HoraWidgetModule.kt`: A native React Native module exposing `syncWidget` to the JS side. It writes the widget payload to `SharedPreferences` and triggers a widget broadcast update.
     - `HoraWidgetPackage.kt`: Registers the native module.
   * Modifies `MainApplication.kt` (or `MainApplication.java`) to inject and register `HoraWidgetPackage`.

2. **React Native Bridge (`services/widget-sync.ts`)**:
   * When data updates, the app triggers `syncWidgetSnapshot()`.
   * It formats the current hora's localized title, symbol, and active time range using JavaScript.
   * It calls the native module:
     ```typescript
     HoraWidgetModule.syncWidget(title, grahaName, grahaSymbol, timeRange, isHighlighted);
     ```
   * The native module saves this data to Android `SharedPreferences` and fires an `ACTION_APPWIDGET_UPDATE` broadcast.
   * `HoraWidgetReceiver` intercepts the broadcast, pulls the fresh data from `SharedPreferences`, and updates the native widget views instantly.
