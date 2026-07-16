/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform, type ColorSchemeName } from 'react-native';

const tintColorLight = '#8F4E1F';
const tintColorDark = '#F1B84B';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const AppThemes = {
  light: {
    screen: '#F7EFE1',
    surface: '#FFF8EA',
    surfaceMuted: '#F0E2CC',
    text: '#281B10',
    textMuted: '#806C55',
    border: '#ECD8B6',
    inverse: '#2A2119',
    inverseText: '#FFF8EA',
    accent: '#D28719',
    accentText: '#251500',
    danger: '#7E271B',
    dangerSoft: '#FFE0D8',
    shadow: '#22170D',
    tabBackground: '#FFF8EA',
    tabBorder: '#E8D7B9',
    tabActive: '#8F4E1F',
    tabInactive: '#7D7468',
    tableBadge: '#E9D8BD',
  },
  dark: {
    screen: '#171411',
    surface: '#241F1A',
    surfaceMuted: '#302820',
    text: '#F7EFE1',
    textMuted: '#BCA98F',
    border: '#463A2E',
    inverse: '#F7EFE1',
    inverseText: '#24180E',
    accent: '#F1B84B',
    accentText: '#211505',
    danger: '#FF9D86',
    dangerSoft: '#482219',
    shadow: '#000000',
    tabBackground: '#241F1A',
    tabBorder: '#3B3026',
    tabActive: '#F1B84B',
    tabInactive: '#A59683',
    tableBadge: '#3A3128',
  },
} as const;

export type AppTheme = (typeof AppThemes)[keyof typeof AppThemes];

export function getAppTheme(colorScheme: ColorSchemeName): AppTheme {
  return AppThemes[colorScheme === 'dark' ? 'dark' : 'light'];
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
