import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { t } from '@/locales/translations';
import { requestRequiredPermissions, syncPermissionState } from '@/services/permissions';
import { useAppStore } from '@/store/app-store';

export default function PermissionsScreen() {
  const [isRequesting, setIsRequesting] = useState(false);
  const theme = getAppTheme(useColorScheme());
  const language = useAppStore((state) => state.language);
  const permissions = useAppStore((state) => state.permissions);
  const canContinue = permissions.locationGranted && permissions.notificationsGranted;

  const rows = useMemo(
    () => [
      { label: t(language, 'location'), granted: permissions.locationGranted },
      { label: t(language, 'notifications'), granted: permissions.notificationsGranted },
    ],
    [language, permissions.locationGranted, permissions.notificationsGranted],
  );

  useEffect(() => {
    syncPermissionState();
  }, []);

  useEffect(() => {
    if (canContinue) {
      router.replace('/(tabs)');
    }
  }, [canContinue]);

  async function handleRequest() {
    setIsRequesting(true);
    const nextPermissions = await requestRequiredPermissions();
    setIsRequesting(false);

    if (nextPermissions.locationGranted && nextPermissions.notificationsGranted) {
      router.replace('/(tabs)');
    }
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.inverse }]}>
      <View style={[styles.panel, { backgroundColor: theme.surface }]}>
        <Text style={[styles.kicker, { color: theme.accent }]}>{t(language, 'appTitle')}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{t(language, 'permissionTitle')}</Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>{t(language, 'permissionBody')}</Text>

        <View style={styles.permissionList}>
          {rows.map((row) => (
            <View key={row.label} style={[styles.permissionRow, { borderColor: theme.border }]}>
              <Text style={[styles.permissionLabel, { color: theme.text }]}>{row.label}</Text>
              <Text style={[styles.permissionValue, row.granted && styles.permissionGranted]}>
                {row.granted ? t(language, 'granted') : t(language, 'needed')}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={handleRequest}
          disabled={isRequesting}>
          {isRequesting ? (
            <ActivityIndicator color={theme.accentText} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.accentText }]}>
              {t(language, 'enablePermissions')}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#211B15',
    padding: 24,
  },
  panel: {
    gap: 22,
    borderRadius: 28,
    backgroundColor: '#FFF8EA',
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 30,
    elevation: 12,
  },
  kicker: {
    color: '#8D4E21',
    fontFamily: 'Switzer-Bold',
    fontSize: 13,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#24180E',
    fontFamily: 'Switzer-Extrabold',
    fontSize: 38,
    lineHeight: 42,
  },
  body: {
    color: '#6B5A48',
    fontFamily: 'Switzer-Regular',
    fontSize: 17,
    lineHeight: 25,
  },
  permissionList: {
    gap: 10,
  },
  permissionRow: {
    alignItems: 'center',
    borderColor: '#E7D0AA',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  permissionLabel: {
    color: '#2E2115',
    fontFamily: 'Switzer-Semibold',
    fontSize: 16,
  },
  permissionValue: {
    color: '#B54432',
    fontFamily: 'Switzer-Bold',
    fontSize: 14,
  },
  permissionGranted: {
    color: '#2F7D52',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F0A51A',
    borderRadius: 18,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonText: {
    color: '#2A1707',
    fontFamily: 'Switzer-Extrabold',
    fontSize: 16,
  },
});
